package com.vehicle.chasis.service;

import com.vehicle.chasis.dto.DecodedChassis;
import com.vehicle.chasis.dto.VehicleRequest;
import com.vehicle.chasis.entity.VehicleMaster;
import com.vehicle.chasis.repository.VehicleMasterRepository;
import com.vehicle.chasis.util.ChassisUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import net.sourceforge.tess4j.Tesseract;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import java.io.File;
import java.util.*;



import java.util.List;


// IMAGE EXPORT
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;


@Service
@RequiredArgsConstructor
public class VehicleMasterService {

    private final VehicleMasterRepository repository;

   @Value("${ocr.tessdata.path}")
private String tessdataPath;

    // ✅ Save single vehicle
    public VehicleMaster save(VehicleRequest request) {

        if (repository.existsByVehicleNo(request.vehicleNo())) {
            throw new RuntimeException("Vehicle number already exists");
        }

        if (repository.existsByChassisNumber(request.chassisNumber())) {
            throw new RuntimeException("Chassis number already exists");
        }

        DecodedChassis decoded = ChassisUtil.decode(request.chassisNumber());

        VehicleMaster vehicle = new VehicleMaster();
        vehicle.setVehicleNo(request.vehicleNo());
        vehicle.setChassisNumber(request.chassisNumber());
        vehicle.setChassisType(decoded.chassisType());
        vehicle.setYear(decoded.year());
        vehicle.setPlant(decoded.plant());
        vehicle.setMonth(decoded.month());
   
        return repository.save(vehicle);
    }

    public Page<VehicleMaster> search(
            String vehicleNo,
            String chassisNumber,
            String plant,
            String year,
            String month,
            int page,
            boolean fetchDropdownData 
    ) {

        Pageable pageable = PageRequest.of(page, 50);

        Specification<VehicleMaster> spec =
                (root, query, cb) -> cb.conjunction(); // base = TRUE

        boolean hasFilter = false;

        if (vehicleNo != null && !vehicleNo.isBlank()) {
            hasFilter = true;
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.upper(root.get("vehicleNo")),
                            "%" + vehicleNo.toUpperCase() + "%"));
        }

        if (chassisNumber != null && !chassisNumber.isBlank()) {
            hasFilter = true;

            String value = chassisNumber.startsWith("MAT")
                    ? chassisNumber
                    : "MAT" + chassisNumber;

            spec = spec.and((root, query, cb) ->
                    cb.like(cb.upper(root.get("chassisNumber")),
                            "%" + value.toUpperCase() + "%"));
        }

        if (plant != null && !plant.isBlank()) {
            hasFilter = true;
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("plant"), plant));
        }

        if (year != null && !year.isBlank()) {
    hasFilter = true;

    spec = spec.and((root, query, cb) -> {
        query.distinct(true); // 🔥 IMPORTANT for dropdown logic support
        return cb.equal(root.get("year"), year);
    });
}

       if (month != null && !month.isBlank()) {
    hasFilter = true;

    spec = spec.and((root, query, cb) -> {
        // If year selected, month becomes dependent automatically
        if (year != null && !year.isBlank()) {
            return cb.and(
                    cb.equal(root.get("year"), year),
                    cb.equal(root.get("month"), month)
            );
        }
        return cb.equal(root.get("month"), month);
    });
}

        // ✅ IMPORTANT: prevent "return all data"
        if (!hasFilter) {
            return Page.empty(pageable);
        }

        return repository.findAll(spec, pageable);
    }
    // ✅ NEW: Get full database
    public List<VehicleMaster> getAllVehicles() {
        return repository.findAll();
    }

    // ✅ Upload Excel with duplicate handling

    public String uploadExcel(MultipartFile file) {

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            List<VehicleMaster> toSave = new ArrayList<>();
            int savedCount = 0;

            // ✅ ADD THIS (MISSING PART)
            Set<String> existingVehicleNos = new HashSet<>();
            Set<String> existingChassisNos = new HashSet<>();

            List<VehicleMaster> existingList = repository.findAll();
            for (VehicleMaster v : existingList) {
                existingVehicleNos.add(v.getVehicleNo());
                existingChassisNos.add(v.getChassisNumber());
            }

            Set<String> fileVehicleNos = new HashSet<>();
            Set<String> fileChassisNos = new HashSet<>();

            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {

                Row row = sheet.getRow(i);
                if (row == null) continue;

                Cell vehicleCell = row.getCell(0);
                Cell chassisCell = row.getCell(1);

                if (vehicleCell == null || chassisCell == null) continue;

                String vehicleNo = formatter.formatCellValue(vehicleCell).trim();
                String chassisNumber = formatter.formatCellValue(chassisCell).trim();

                if (vehicleNo.isEmpty() || chassisNumber.isEmpty()) continue;

                if (existingVehicleNos.contains(vehicleNo) ||
                        existingChassisNos.contains(chassisNumber)) {
                    continue;
                }

                if (fileVehicleNos.contains(vehicleNo) ||
                        fileChassisNos.contains(chassisNumber)) {
                    continue;
                }

                fileVehicleNos.add(vehicleNo);
                fileChassisNos.add(chassisNumber);

                DecodedChassis decoded = ChassisUtil.decode(chassisNumber);

                VehicleMaster v = new VehicleMaster();
                v.setVehicleNo(vehicleNo);
                v.setChassisNumber(chassisNumber);
                v.setChassisType(decoded.chassisType());
                v.setYear(decoded.year());
                v.setPlant(decoded.plant());
                v.setMonth(decoded.month());

                toSave.add(v);
            }

            if (!toSave.isEmpty()) {
                repository.saveAll(toSave);
                savedCount = toSave.size();
            }

            return "Upload successful. Saved records: " + savedCount;

        } catch (Exception e) {
            throw new RuntimeException("Excel upload failed: " + e.getMessage());
        }
    }

    public String uploadFile(
            MultipartFile file,
            String uploadType
    ) {

        switch (uploadType.toUpperCase()) {

            case "EXCEL":
                return uploadExcel(file);

            case "PDF":
                return uploadPdf(file);

            case "IMAGE":
                return uploadImage(file);

            default:
                throw new RuntimeException(
                        "Invalid upload type"
                );
        }
    }

    private String uploadPdf(
            MultipartFile file
    ) {

        try {

            PDDocument document = Loader.loadPDF(file.getInputStream().readAllBytes());

            PDFTextStripper stripper =
                    new PDFTextStripper();

            String text =
                    stripper.getText(document);

            document.close();

            String[] lines =
                    text.split("\\r?\\n");

            return saveExtractedData(lines);

        }
        catch (Exception e) {

            throw new RuntimeException(
                    "PDF upload failed : "
                            + e.getMessage()
            );
        }
    }

  private String uploadImage(MultipartFile file) {

    try {
        System.out.println("IMAGE UPLOAD STARTED");

        // ✅ Load tessdata from classpath
        File tessdataDir = new ClassPathResource("tessdata").getFile();

        if (!tessdataDir.exists()) {
            throw new RuntimeException("Tessdata folder not found in resources");
        }

        Tesseract tesseract = new Tesseract();

        tesseract.setDatapath(tessdataPath);
        // IMPORTANT: parent folder
         tesseract.setDatapath(tessdataDir.getAbsolutePath());

        tesseract.setLanguage("eng");

        File temp = File.createTempFile("ocr", ".png");
        file.transferTo(temp);

        String text = tesseract.doOCR(temp);

        System.out.println(text);

        String[] lines = text.split("\\r?\\n");
        return saveExtractedData(lines);

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Image upload failed: " + e.getMessage());
    }
  }


    private String saveExtractedData(String[] lines) {

        List<VehicleMaster> toSave = new ArrayList<>();
        int savedCount = 0;

        Set<String> existingVehicleNos = new HashSet<>();
        Set<String> existingChassisNos = new HashSet<>();

        List<VehicleMaster> existingList = repository.findAll();
        for (VehicleMaster v : existingList) {
            existingVehicleNos.add(v.getVehicleNo());
            existingChassisNos.add(v.getChassisNumber());
        }

        Set<String> fileVehicleNos = new HashSet<>();
        Set<String> fileChassisNos = new HashSet<>();

        

        // ⚠️ ASSUMPTION: format = vehicleNo chassisNumber
        Pattern pattern = Pattern.compile(
                "([A-Z]{2}\\d{2}[A-Z]{2}\\d{4})\\s+(MAT[A-Z0-9]+)"
        );

        for (String line : lines) {

            if (line == null || line.isBlank()) {
                continue;
            }

            String cleanedLine = line.trim();
            String normalizedLine = cleanedLine.toUpperCase()
                    .replaceAll("[^A-Z0-9\\s]", " ")
                    .replaceAll("\\s+", " ");

            System.out.println("LINE => [" + cleanedLine + "]");
            System.out.println("NORMALIZED => [" + normalizedLine + "]");

            Matcher matcher = pattern.matcher(normalizedLine);

            if (!matcher.find()) {
                continue;
            }

            String vehicleNo = matcher.group(1);
            String chassisNumber = matcher.group(2);

            System.out.println(
                    "MATCHED => " +
                            vehicleNo + " | " +
                            chassisNumber
            );

            if (existingVehicleNos.contains(vehicleNo)
                    || existingChassisNos.contains(chassisNumber)) {
                continue;
            }

            if (fileVehicleNos.contains(vehicleNo)
                    || fileChassisNos.contains(chassisNumber)) {
                continue;
            }

            fileVehicleNos.add(vehicleNo);
            fileChassisNos.add(chassisNumber);

            DecodedChassis decoded = ChassisUtil.decode(chassisNumber);

            VehicleMaster v = new VehicleMaster();
            v.setVehicleNo(vehicleNo);
            v.setChassisNumber(chassisNumber);
            v.setChassisType(decoded.chassisType());
            v.setYear(decoded.year());
            v.setPlant(decoded.plant());
            v.setMonth(decoded.month());

            toSave.add(v);
        }


        if (!toSave.isEmpty()) {
            repository.saveAll(toSave);
            savedCount = toSave.size();
        }

        return "Upload successful. Saved records: " + savedCount;
    }

    public Page<VehicleMaster> getAllPaginated(Pageable pageable) {
        return repository.findAll(pageable);
    }

    
  public VehicleMaster getById(Long id) {

    return repository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Vehicle not found"));
}

public VehicleMaster updateVehicle(
        Long id,
        VehicleRequest request
) {

    VehicleMaster vehicle =
            repository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Vehicle not found"));

    if (request.vehicleNo() == null ||
            request.vehicleNo().isBlank()) {
        throw new RuntimeException("Vehicle Number is required");
    }

    if (request.chassisNumber() == null ||
            request.chassisNumber().isBlank()) {
        throw new RuntimeException("Chassis Number is required");
    }

    if (repository.existsByVehicleNoAndIdNot(
            request.vehicleNo(),
            id)) {

        throw new RuntimeException(
                "Vehicle number already exists"
        );
    }

    if (repository.existsByChassisNumberAndIdNot(
            request.chassisNumber(),
            id)) {

        throw new RuntimeException(
                "Chassis number already exists"
        );
    }

    DecodedChassis decoded =
            ChassisUtil.decode(request.chassisNumber());

    vehicle.setVehicleNo(request.vehicleNo());
    vehicle.setChassisNumber(request.chassisNumber());

    vehicle.setChassisType(decoded.chassisType());
    vehicle.setYear(decoded.year());
    vehicle.setPlant(decoded.plant());
    vehicle.setMonth(decoded.month());

    return repository.save(vehicle);
}

public void deleteVehicle(Long id) {

    VehicleMaster vehicle =
            repository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Vehicle not found"));

    repository.delete(vehicle);
}

// ========================= EXPORT LOGIC =========================
public List<VehicleMaster> getExportData(
        String vehicleNo,
        String chassisNumber,
        String plant,
        String year,
        String month
) {
    Specification<VehicleMaster> spec =
            (root, query, cb) -> cb.conjunction();

    if (vehicleNo != null && !vehicleNo.isBlank()) {
        spec = spec.and((root, query, cb) ->
                cb.like(cb.upper(root.get("vehicleNo")),
                        "%" + vehicleNo.toUpperCase() + "%"));
    }

    if (chassisNumber != null && !chassisNumber.isBlank()) {
        spec = spec.and((root, query, cb) ->
                cb.like(cb.upper(root.get("chassisNumber")),
                        "%" + chassisNumber.toUpperCase() + "%"));
    }

    if (plant != null && !plant.isBlank()) {
        spec = spec.and((root, query, cb) ->
                cb.equal(root.get("plant"), plant));
    }

    if (year != null && !year.isBlank()) {
        spec = spec.and((root, query, cb) ->
                cb.equal(root.get("year"), year));
    }

    if (month != null && !month.isBlank()) {
        spec = spec.and((root, query, cb) ->
                cb.equal(root.get("month"), month));
    }

    return repository.findAll(spec);
}

//for exporting excel
public void exportExcel(List<VehicleMaster> data,
                         HttpServletResponse response) throws Exception {
    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Vehicles");

    Row header = sheet.createRow(0);
    header.createCell(0).setCellValue("Vehicle No");
    header.createCell(1).setCellValue("Chassis No");
    header.createCell(2).setCellValue("Plant");
    header.createCell(3).setCellValue("Year");
    header.createCell(4).setCellValue("Month");

    int rowNum = 1;

    for (VehicleMaster v : data) {
        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue(v.getVehicleNo());
        row.createCell(1).setCellValue(v.getChassisNumber());
        row.createCell(2).setCellValue(v.getPlant());
        row.createCell(3).setCellValue(v.getYear());
        row.createCell(4).setCellValue(v.getMonth());
    }

    response.setContentType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.setHeader(
            "Content-Disposition",
            "attachment; filename=vehicles.xlsx"
    );

    workbook.write(response.getOutputStream());
    workbook.close();
}

//for exporting pdf
public void exportPdf(List<VehicleMaster> data,
                      HttpServletResponse response) throws Exception {

    response.setContentType("application/pdf");
    response.setHeader("Content-Disposition", "attachment; filename=vehicles.pdf");

    com.itextpdf.text.Document document =
            new com.itextpdf.text.Document();

    com.itextpdf.text.pdf.PdfWriter.getInstance(
            document,
            response.getOutputStream()
    );

    document.open();

    document.add(new com.itextpdf.text.Paragraph("Vehicle Report\n\n"));

    for (VehicleMaster v : data) {
        document.add(new com.itextpdf.text.Paragraph(
                v.getVehicleNo() + " | " +
                v.getChassisNumber() + " | " +
                v.getPlant() + " | " +
                v.getYear() + " | " +
                v.getMonth()
        ));
    }

    document.close();
}

//for exporting image
public void exportImage(List<VehicleMaster> data,
                        HttpServletResponse response) throws Exception {

    BufferedImage image = new BufferedImage(
            900,
            40 + (data.size() * 20),
            BufferedImage.TYPE_INT_RGB
    );

    Graphics2D g = image.createGraphics();
    g.setColor(Color.WHITE);
    g.fillRect(0, 0, 900, image.getHeight());

    g.setColor(Color.BLACK);

    int y = 20;

    for (VehicleMaster v : data) {
        g.drawString(
                v.getVehicleNo() + " | " +
                v.getChassisNumber() + " | " +
                v.getPlant() + " | " +
                v.getYear() + " | " +
                v.getMonth(),
                20,
                y
        );
        y += 20;
    }

    g.dispose();

    response.setContentType("image/png");
    response.setHeader("Content-Disposition", "attachment; filename=vehicles.png");

    ImageIO.write(image, "png", response.getOutputStream());
}
}
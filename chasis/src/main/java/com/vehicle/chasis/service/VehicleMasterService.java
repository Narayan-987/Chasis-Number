package com.vehicle.chasis.service;

import com.vehicle.chasis.dto.DecodedChassis;
import com.vehicle.chasis.dto.VehicleRequest;
import com.vehicle.chasis.entity.VehicleMaster;
import com.vehicle.chasis.repository.VehicleMasterRepository;
import com.vehicle.chasis.util.ChassisUtil;
import lombok.RequiredArgsConstructor;
import net.sourceforge.tess4j.Tesseract;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VehicleMasterService {

    private final VehicleMasterRepository repository;

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
            int page
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
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("year"), year));
        }

        if (month != null && !month.isBlank()) {
            hasFilter = true;
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("month"), month));
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

                vehicleCell.setCellType(CellType.STRING);
                chassisCell.setCellType(CellType.STRING);

                String vehicleNo = vehicleCell.getStringCellValue().trim();
                String chassisNumber = chassisCell.getStringCellValue().trim();

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

    private String uploadImage(
            MultipartFile file
    ) {

        try {

            Tesseract tesseract =
                    new Tesseract();

            tesseract.setDatapath(
                    "C:/tessdata"
            );

            File temp =
                    File.createTempFile(
                            "ocr",
                            ".png"
                    );

            file.transferTo(temp);

            String text =
                    tesseract.doOCR(temp);

            String[] lines =
                    text.split("\\r?\\n");

            return saveExtractedData(lines);

        }
        catch (Exception e) {

            throw new RuntimeException(
                    "Image upload failed : "
                            + e.getMessage()
            );
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

        for (String line : lines) {

            if (line == null || line.isBlank()) continue;

            // ⚠️ ASSUMPTION: format = vehicleNo,chassisNumber
            String[] parts = line.split(",");

            if (parts.length < 2) continue;

            String vehicleNo = parts[0].trim();
            String chassisNumber = parts[1].trim();

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
    }

    public Page<VehicleMaster> getAllPaginated(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
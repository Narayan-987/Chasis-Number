package com.vehicle.chasis.controller;

import com.vehicle.chasis.dto.VehicleRequest;
import com.vehicle.chasis.entity.VehicleMaster;
import com.vehicle.chasis.service.VehicleMasterService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;


@RestController
@RequestMapping("/api/master")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173","http://localhost:5174", "http://localhost:3000"})
public class VehicleMasterController {

    private final VehicleMasterService service;

    // ✅ Save single record (ADMIN only)
    @PostMapping
    public VehicleMaster save(@Valid @RequestBody VehicleRequest request) {
        return service.save(request);
    }

    // ✅ Upload Excel file (ADMIN only)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadType") String uploadType
    ) {
  System.out.println("Received file: " + file.getOriginalFilename() + ", uploadType: " + uploadType);
        return ResponseEntity.ok(
                service.uploadFile(file, uploadType)
        );
    }

    // ✅ Search API (USER & ADMIN)
    @GetMapping("/search")
    public Page<VehicleMaster> search(
            @RequestParam(required = false) String vehicleNo,
            @RequestParam(required = false) String chassisNumber,
            @RequestParam(required = false) String plant,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String month,
            @RequestParam(defaultValue = "0") int page
    ) {
        return service.search(
                vehicleNo,
                chassisNumber,
                plant,
                year,
                month,
                page,
                false // fetchDropdownData = false for search
                
        );
    }

    // ✅ View full database (USER & ADMIN)
   @GetMapping("/all")
   public List<VehicleMaster> getAll() {
       return service.getAllVehicles();
   }

    @GetMapping("/all-paginated")
    public Page<VehicleMaster> getAllPaginated(Pageable pageable) {
        return service.getAllPaginated(pageable);
    }

    @GetMapping("/{id}")
public VehicleMaster getById(
        @PathVariable Long id
) {
    return service.getById(id);
}

@PutMapping("/{id}")
public VehicleMaster updateVehicle(
        @PathVariable Long id,
        @Valid @RequestBody VehicleRequest request
) {
    return service.updateVehicle(id, request);
}

@DeleteMapping("/{id}")
public ResponseEntity<?> deleteVehicle(
        @PathVariable Long id
) {

    service.deleteVehicle(id);

    return ResponseEntity.ok(
            new DeleteResponse(
                    "Vehicle deleted successfully"
            )
    );
}

public record DeleteResponse(String message) {}

//for downloading excel,pdf and image
@GetMapping("/export")
public void exportData(
        @RequestParam String type,
        @RequestParam(required = false) String vehicleNo,
        @RequestParam(required = false) String chassisNumber,
        @RequestParam(required = false) String plant,
        @RequestParam(required = false) String year,
        @RequestParam(required = false) String month,
        HttpServletResponse response
) throws Exception {

    List<VehicleMaster> data =
            service.getExportData(
                    vehicleNo,
                    chassisNumber,
                    plant,
                    year,
                    month
            );

    switch (type.toLowerCase()) {

        case "excel":
            service.exportExcel(data, response);
            break;

        case "pdf":
            service.exportPdf(data, response);
            break;

        case "image":
            service.exportImage(data, response);
            break;

        default:
            throw new RuntimeException("Invalid export type: " + type);
    }
}

}
    
   
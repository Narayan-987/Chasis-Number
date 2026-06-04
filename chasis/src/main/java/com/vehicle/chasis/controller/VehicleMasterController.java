package com.vehicle.chasis.controller;

import com.vehicle.chasis.dto.VehicleRequest;
import com.vehicle.chasis.entity.VehicleMaster;
import com.vehicle.chasis.service.VehicleMasterService;
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
@CrossOrigin("*")
public class VehicleMasterController {

    private final VehicleMasterService service;

    // ✅ Save single record
    @PostMapping
    public VehicleMaster save(@Valid @RequestBody VehicleRequest request) {
        return service.save(request);
    }

    // ✅ Upload Excel file
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadType") String uploadType
    ) {

        return ResponseEntity.ok(
                service.uploadFile(file, uploadType)
        );
    }
    // ✅ Search API
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
                page
        );
    }

    // ✅ NEW: View full database
    @GetMapping("/all")
    public List<VehicleMaster> getAll() {
        return service.getAllVehicles();
    }

    @GetMapping("/all-paginated")
    public Page<VehicleMaster> getAllPaginated(Pageable pageable) {
        return service.getAllPaginated(pageable);
    }
}
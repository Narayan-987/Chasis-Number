package com.vehicle.chasis.dto;

import jakarta.validation.constraints.NotBlank;

public record VehicleRequest(

        @NotBlank(message = "Vehicle number is required")
        String vehicleNo,

        @NotBlank(message = "Chassis number is required")
        String chassisNumber

) {}
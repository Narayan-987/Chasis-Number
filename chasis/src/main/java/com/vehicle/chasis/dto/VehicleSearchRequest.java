package com.vehicle.chasis.dto;



public record VehicleSearchRequest(

        String vehicleNo,
        String chassisNumber,

        String year,
        String plant,
        String month,

        Integer page,
        Integer size
) {}
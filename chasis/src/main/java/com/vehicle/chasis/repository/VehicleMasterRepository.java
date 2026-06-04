package com.vehicle.chasis.repository;

import com.vehicle.chasis.entity.VehicleMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VehicleMasterRepository
        extends JpaRepository<VehicleMaster, Long>,
        JpaSpecificationExecutor<VehicleMaster> {

    boolean existsByVehicleNo(String vehicleNo);

    boolean existsByChassisNumber(String chassisNumber);
}
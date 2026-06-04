package com.vehicle.chasis.entity;



import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity

@Getter
@Setter
@Table(
        name = "vehicle_master",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "vehicleNo"),
                @UniqueConstraint(columnNames = "chassisNumber")
        })
public class VehicleMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleNo;

    private String chassisNumber;

    private String chassisType;

    private String year;

    private String plant;

    private String month;


}

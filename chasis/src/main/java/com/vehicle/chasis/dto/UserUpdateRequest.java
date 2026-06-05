package com.vehicle.chasis.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    private String username;
    private String email;
    private String companyName;
    private String gstNumber;
    private String role;

}
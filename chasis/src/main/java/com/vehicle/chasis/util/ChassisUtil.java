package com.vehicle.chasis.util;

import com.vehicle.chasis.dto.DecodedChassis;

import java.util.Map;

public class ChassisUtil {

    private static final Map<String,String> YEAR_MAP = Map.ofEntries(
            Map.entry("9","2009"),
            Map.entry("A","2010"),
            Map.entry("B","2011"),
            Map.entry("C","2012"),
            Map.entry("D","2013"),
            Map.entry("E","2014"),
            Map.entry("F","2015"),
            Map.entry("G","2016"),
            Map.entry("H","2017"),
            Map.entry("J","2018"),
            Map.entry("K","2019"),
            Map.entry("L","2020"),
            Map.entry("M","2021"),
            Map.entry("N","2022"),
            Map.entry("P","2023"),
            Map.entry("Q","2024"),
            Map.entry("R","2025"),
            Map.entry("S","2026")
    );

    private static final Map<String,String> PLANT_MAP = Map.ofEntries(
            Map.entry("0","WC-1 Lucknow"),
            Map.entry("1","Jamshedpur I"),
            Map.entry("2","Jamshedpur II"),
            Map.entry("3","Jamshedpur III"),
            Map.entry("5","EC-1 Lucknow"),
            Map.entry("6","Dharwad-I"),
            Map.entry("7","D Block Pune"),
            Map.entry("8","H Block Pune"),
            Map.entry("9","J Block Pune"),
            Map.entry("A","EC-2 Lucknow"),
            Map.entry("B","IBF-1, Lucknow"),
            Map.entry("C","APD, Chinchwad"),
            Map.entry("D","Pantnagar-V"),
            Map.entry("E","Pantnagar-VI"),
            Map.entry("F","Dharwad-II"),
            Map.entry("G","Defence Veh Line, Jamshedpur"),
            Map.entry("H","Pantnagar-VII"),
            Map.entry("J","Pantnagar-IV"),
            Map.entry("K","Sanand"),
            Map.entry("L","TML, Ranjangaon-II"),
            Map.entry("M","Lucknow-MASOP"),
            Map.entry("N","J-Block, Pune, Second Assy Line"),
            Map.entry("P","K-Block, Pune, First TCF Line"),
            Map.entry("R","J14-Block, Pune"),
            Map.entry("S","J13-Block, Pune"),
            Map.entry("T","TML, Ranjangaon-I"),
            Map.entry("V","Pantnagar-I"),
            Map.entry("W","K-Block, Pune, Second TCF Line"),
            Map.entry("X","Singur"),
            Map.entry("U","E9-Block, Pune"),
            Map.entry("Y","Pantnagar-II"),
            Map.entry("Z","Pantnagar-III")
    );

    private static final Map<String,String> MONTH_MAP = Map.ofEntries(
            Map.entry("A","January"),
            Map.entry("B","February"),
            Map.entry("C","March"),
            Map.entry("D","April"),
            Map.entry("E","May"),
            Map.entry("F","June"),
            Map.entry("G","July"),
            Map.entry("H","August"),
            Map.entry("J","September"),
            Map.entry("K","October"),
            Map.entry("N","November"),
            Map.entry("P","December")
    );



    public static DecodedChassis decode(String chassis) {

        if (chassis == null || chassis.length() < 12) {
            throw new RuntimeException("Invalid Chassis Number");
        }

        String chassisType = chassis.substring(3, 9);

        String yearCode =
                String.valueOf(chassis.charAt(9));

        String plantCode =
                String.valueOf(chassis.charAt(10));

        String monthCode =
                String.valueOf(chassis.charAt(11));

        String year =
                YEAR_MAP.getOrDefault(yearCode, yearCode);

        String plant =
                PLANT_MAP.getOrDefault(plantCode, plantCode);

        String month =
                MONTH_MAP.getOrDefault(monthCode, monthCode);

        return new DecodedChassis(
                chassisType,
                year,
                plant,
                month
        );
    }
}
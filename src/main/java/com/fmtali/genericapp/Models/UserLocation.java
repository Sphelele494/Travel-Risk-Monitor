package com.fmtali.genericapp.Models;

import javax.annotation.Generated;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLocation {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long userId;
    private double homeLatitude;
    private double homeLongitude;
    private double workLatitude;
    private double workLongitude;


    
}

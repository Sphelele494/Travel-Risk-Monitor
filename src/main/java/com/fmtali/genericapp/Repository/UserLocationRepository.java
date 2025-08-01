package com.fmtali.genericapp.Repository;

import com.fmtali.genericapp.Models.UserLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {

    UserLocation findByUserId(Long userId);
}
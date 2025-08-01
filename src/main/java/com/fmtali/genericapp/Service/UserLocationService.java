package com.fmtali.genericapp.Service;

import com.fmtali.genericapp.Models.UserLocation;
import com.fmtali.genericapp.Repository.UserLocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserLocationService {

    private final UserLocationRepository userLocationRepository;

    public UserLocationService(UserLocationRepository userLocationRepository) {
        this.userLocationRepository = userLocationRepository;
    }

    public UserLocation getUserLocationById(Long userId) {
        return userLocationRepository.findByUserId(userId);
    }

    public List<UserLocation> getAllUserLocations() {
        return userLocationRepository.findAll();
    }

    @Transactional
    public UserLocation updateUserLocation(Long userId, UserLocation userLocationDetails) {
        UserLocation userLocation = userLocationRepository.findByUserId(userId);
        if (userLocation == null) {
            throw new RuntimeException("User location not found with id: " + userId);
        }

        userLocation.setHomeLatitude(userLocationDetails.getHomeLatitude());
        userLocation.setHomeLongitude(userLocationDetails.getHomeLongitude());
        userLocation.setWorkLatitude(userLocationDetails.getWorkLatitude());
        userLocation.setWorkLongitude(userLocationDetails.getWorkLongitude());

        return userLocationRepository.save(userLocation);
    }
}
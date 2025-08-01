package com.fmtali.genericapp.Controller;

import com.fmtali.genericapp.Models.UserLocation;
import com.fmtali.genericapp.Service.UserLocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-locations")
public class UserLocationController {

    private final UserLocationService userLocationService;

    public UserLocationController(UserLocationService userLocationService) {
        this.userLocationService = userLocationService;
    }

    @GetMapping("/{userId}")
    public UserLocation getUserLocation(@PathVariable Long userId) {
        return userLocationService.getUserLocationById(userId);
    }

    @GetMapping
    public List<UserLocation> getAllUserLocations() {
        return userLocationService.getAllUserLocations();
    }

    @PutMapping("/{userId}")
    public UserLocation updateUserLocation(
            @PathVariable Long userId,
            @RequestBody UserLocation userLocationDetails) {
        return userLocationService.updateUserLocation(userId, userLocationDetails);
    }

    @PostMapping
    public UserLocation createUserLocation(@RequestBody UserLocation userLocation) {
        return userLocationService.createUserLocation(userLocation);
    }
}

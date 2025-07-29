package com.fmtali.genericapp.util.constants;

public enum Roles {

    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private  String role;

    Roles(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }


    
}

package com.asvale.dto;

import lombok.Data;
import java.time.LocalDateTime;

import com.asvale.enums.UserType;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String documentNumber;
    private String phone;
    private UserType userType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    private boolean active;
    private boolean isAdmin;

    public boolean isAdmin() {
        return isAdmin;
    }
    public void setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
}
 
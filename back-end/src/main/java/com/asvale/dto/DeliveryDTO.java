package com.asvale.dto;

import com.asvale.enums.DeliveryStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeliveryDTO {
    private Long id;
    private Long userId;
    private String companyName;
    private String documentNumber;
    private String address;
    private String city;
    private String state;
    private String phone;
    private LocalDateTime scheduledDate;
    private String notes;
    private DeliveryStatus status;

    private String materials;

    private Double price;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
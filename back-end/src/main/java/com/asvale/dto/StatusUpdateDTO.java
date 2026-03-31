package com.asvale.dto;

import com.asvale.enums.DeliveryStatus;
import lombok.Data;
 
@Data
public class StatusUpdateDTO {
    private DeliveryStatus status;
} 
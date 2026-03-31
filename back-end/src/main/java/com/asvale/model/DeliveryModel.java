package com.asvale.model;

import com.asvale.enums.DeliveryStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Data
@Entity
@Table(name = "deliveries")
public class DeliveryModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "document_number", nullable = false)
    private String documentNumber;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    private String phone;

    @Column(nullable = false)
    private LocalDateTime scheduledDate;

    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus status = DeliveryStatus.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "text")
    private String materials;

    @Column(name = "price")
    private Double price;

    public JsonNode getMaterialsJson() {
        if (materials == null) return null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(materials);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isCategoryEnabled(String category) {
        JsonNode node = getMaterialsJson();
        if (node != null && node.has(category)) {
            JsonNode cat = node.get(category);
            return cat.has("enabled") && cat.get("enabled").asBoolean();
        }
        return false;
    }

    public boolean isTypeEnabled(String category, String type) {
        JsonNode node = getMaterialsJson();
        if (node != null && node.has(category)) {
            JsonNode cat = node.get(category);
            if (cat.has(type)) {
                JsonNode t = cat.get(type);
                return t.has("enabled") && t.get("enabled").asBoolean();
            }
        }
        return false;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = DeliveryStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

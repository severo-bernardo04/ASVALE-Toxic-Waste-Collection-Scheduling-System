package com.asvale.enums;

public enum DeliveryStatus {
    PENDING("Pendente"),
    ACCEPTED("Aceita"),
    COMPLETED("Concluída"),
    CANCELLED("Cancelada");

    private final String description;

    DeliveryStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 
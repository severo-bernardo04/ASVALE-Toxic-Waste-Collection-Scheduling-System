package com.asvale.dto;

public class DistanceResponseDTO {
    private String distance;
    private String duration;
    private String polyline;
    private double price;

    public DistanceResponseDTO() {}

    public DistanceResponseDTO(String distance, String duration, String polyline, double price) {
        this.distance = distance;
        this.duration = duration;
        this.polyline = polyline;
        this.price = price;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getPolyline() {
        return polyline;
    }

    public void setPolyline(String polyline) {
        this.polyline = polyline;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
} 
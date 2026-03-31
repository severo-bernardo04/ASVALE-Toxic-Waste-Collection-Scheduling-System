package com.asvale.enums;

import java.time.LocalTime;

public enum ScheduleTimeSlot {
    SLOT_08_10(LocalTime.of(8, 0), LocalTime.of(10, 0)),
    SLOT_10_12(LocalTime.of(10, 0), LocalTime.of(12, 0)),
    SLOT_14_16(LocalTime.of(14, 0), LocalTime.of(16, 0)),
    SLOT_16_18(LocalTime.of(16, 0), LocalTime.of(18, 0));

    private final LocalTime startTime;
    private final LocalTime endTime;

    ScheduleTimeSlot(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public static ScheduleTimeSlot fromStartTime(LocalTime startTime) {
        for (ScheduleTimeSlot slot : values()) {
            if (slot.getStartTime().equals(startTime)) {
                return slot;
            }
        }
        return null;
    }
} 
package com.asvale.enums;

public enum ScheduleStatus {
    PENDING,    // Agendamento solicitado, aguardando confirmação/processamento
    CONFIRMED,  // Agendamento confirmado pela ASVALE
    COMPLETED,  // Agendamento concluído (entrega/coleta realizada)
    CANCELLED   // Agendamento cancelado pelo usuário ou pela ASVALE
} 
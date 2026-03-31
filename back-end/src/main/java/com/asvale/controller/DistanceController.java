package com.asvale.controller;

import com.asvale.dto.DistanceRequestDTO;
import com.asvale.dto.DistanceResponseDTO;
import com.asvale.service.DistanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/distance")
public class DistanceController {
    private static final Logger logger = LoggerFactory.getLogger(DistanceController.class);
    @Autowired
    private DistanceService distanceService;

    @PostMapping
    public ResponseEntity<?> calculateDistance(@RequestBody DistanceRequestDTO request) {
        logger.info("[DistanceController] POST /api/distance chamado com destino: {}", request.getDestination());
        try {
            DistanceResponseDTO response = distanceService.calculateDistance(request.getDestination());
            logger.info("[DistanceController] Resposta de distância: {}", response.getDistance());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("[DistanceController] Erro ao calcular distância: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Erro ao calcular distância: " + e.getMessage()));
        }
    }
} 
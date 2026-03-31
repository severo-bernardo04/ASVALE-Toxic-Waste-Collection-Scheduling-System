package com.asvale.controller;

import com.asvale.dto.DeliveryDTO;
import com.asvale.dto.StatusUpdateDTO;
import com.asvale.enums.DeliveryStatus;
import com.asvale.service.DeliveryService;
import com.asvale.model.UserModel;
import com.asvale.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<DeliveryDTO> createDelivery(
            @RequestBody DeliveryDTO deliveryDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserModel user = userRepository.findByDocumentNumber(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(deliveryService.createDelivery(deliveryDTO, user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> getDeliveryById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserModel user = userRepository.findByDocumentNumber(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(deliveryService.getDeliveryById(id, user.getId()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DeliveryDTO>> searchDeliveries(
            @RequestParam(required = false) String documentNumber,
            @RequestParam(required = false) String producerCompany,
            @RequestParam(required = false) String producerRegistration,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserModel user = userRepository.findByDocumentNumber(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(deliveryService.searchDeliveries(documentNumber, producerCompany, producerRegistration, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryDTO> updateDelivery(
            @PathVariable Long id,
            @RequestBody DeliveryDTO deliveryDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserModel user = userRepository.findByDocumentNumber(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(deliveryService.updateDelivery(id, deliveryDTO, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        deliveryService.deleteDelivery(id, Long.parseLong(userDetails.getUsername()));
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<DeliveryDTO>> getAllDeliveries(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(deliveryService.getAllDeliveries(userDetails.getUsername()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateDTO statusUpdate,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserModel user = userRepository.findByDocumentNumber(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(deliveryService.updateStatus(id, statusUpdate.getStatus(), user.getId()));
    }
}

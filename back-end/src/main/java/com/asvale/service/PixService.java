package com.asvale.service;

import com.asvale.model.DeliveryModel;
import com.asvale.model.PixPayment;
import com.asvale.repository.PixPaymentRepository;
import com.asvale.repository.DeliveryRepository;
import com.asvale.enums.DeliveryStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PixService {

    @Value("${asvale.pix.key}")
    private String pixKey;

    @Value("${asvale.merchant.name}")
    private String merchantName;

    @Value("${asvale.merchant.city}")
    private String merchantCity;

    private final PixPaymentRepository pixPaymentRepository;
    private final DeliveryRepository deliveryRepository;

    public PixService(PixPaymentRepository pixPaymentRepository, DeliveryRepository deliveryRepository) {
        this.pixPaymentRepository = pixPaymentRepository;
        this.deliveryRepository = deliveryRepository;
    }

    @Transactional
    public PixPayment generatePixPayment(Long deliveryId) {
        DeliveryModel delivery = deliveryRepository.findById(deliveryId)
            .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        Optional<PixPayment> existingPayment = pixPaymentRepository.findByDeliveryId(deliveryId);
        if (existingPayment.isPresent() && existingPayment.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            return existingPayment.get();
        }

        PixPayment pixPayment = new PixPayment();
        pixPayment.setDelivery(delivery);
        pixPayment.setAmount(BigDecimal.ZERO);
        pixPayment.setTxid("ASVALE" + delivery.getId() + System.currentTimeMillis());

        String payload = generatePixPayload(pixPayment);
        pixPayment.setQrCode(payload);

        return pixPaymentRepository.save(pixPayment);
    }

    private String generatePixPayload(PixPayment payment) {
        StringBuilder payload = new StringBuilder();
        
        payload.append("000201");
        payload.append("010212");
        
        String merchantInfo = String.format("0014BR.GOV.BCB.PIX%s", pixKey);
        payload.append("26").append(String.format("%02d", merchantInfo.length())).append(merchantInfo);
        
        payload.append("52040000");
        payload.append("5303986");
        
        String amount = payment.getAmount().toString();
        payload.append("54").append(String.format("%02d", amount.length())).append(amount);
        
        payload.append("5802BR");
        payload.append("59").append(String.format("%02d", merchantName.length())).append(merchantName);
        payload.append("60").append(String.format("%02d", merchantCity.length())).append(merchantCity);
        
        String txId = payment.getTxid();
        payload.append("62").append(String.format("%02d", txId.length() + 4)).append("05").append(txId);
        
        String crc16 = calculateCRC16(payload.toString());
        payload.append("6304").append(crc16);
        
        return payload.toString();
    }

    private String calculateCRC16(String payload) {
        int crc = 0xFFFF;
        int polynomial = 0x1021;

        byte[] bytes = payload.getBytes();
        for (byte b : bytes) {
            for (int i = 0; i < 8; i++) {
                boolean bit = ((b >> (7 - i) & 1) == 1);
                boolean c15 = ((crc >> 15 & 1) == 1);
                crc <<= 1;
                if (c15 ^ bit) crc ^= polynomial;
            }
        }

        crc &= 0xFFFF;
        return String.format("%04X", crc);
    }

    @Transactional
    public void confirmPayment(String txid) {
        PixPayment payment = pixPaymentRepository.findByTxid(txid)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        payment.setPaidAt(LocalDateTime.now());
        pixPaymentRepository.save(payment);
        
        DeliveryModel delivery = payment.getDelivery();
        if (delivery.getStatus() == DeliveryStatus.PENDING) {
            delivery.setStatus(DeliveryStatus.ACCEPTED);
            deliveryRepository.save(delivery);
        }
    }
} 
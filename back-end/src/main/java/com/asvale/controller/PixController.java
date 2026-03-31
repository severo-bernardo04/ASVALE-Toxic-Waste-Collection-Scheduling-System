package com.asvale.controller;

import com.asvale.model.PixPayment;
import com.asvale.service.PixService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pix")
public class PixController {

    private final PixService pixService;

    public PixController(PixService pixService) {
        this.pixService = pixService;
    }

    @GetMapping("/generate/{deliveryId}")
    public ResponseEntity<PixPayment> generatePixPayment(@PathVariable Long deliveryId) {
        PixPayment pixPayment = pixService.generatePixPayment(deliveryId);
        return ResponseEntity.ok(pixPayment);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> pixWebhook(@RequestBody PixWebhookRequest request) {
        pixService.confirmPayment(request.getTxid());
        return ResponseEntity.ok().build();
    }
}

class PixWebhookRequest {
    private String txid;

    public String getTxid() {
        return txid;
    }

    public void setTxid(String txid) {
        this.txid = txid;
    }
} 
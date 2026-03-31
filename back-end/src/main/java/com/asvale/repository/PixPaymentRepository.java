package com.asvale.repository;

import com.asvale.model.PixPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PixPaymentRepository extends JpaRepository<PixPayment, Long> {
    Optional<PixPayment> findByDeliveryId(Long deliveryId);
    Optional<PixPayment> findByTxid(String txid);
} 
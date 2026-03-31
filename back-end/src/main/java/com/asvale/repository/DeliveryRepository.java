package com.asvale.repository;

import com.asvale.model.DeliveryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<DeliveryModel, Long> {
    List<DeliveryModel> findByDocumentNumber(String documentNumber);
    List<DeliveryModel> findByCompanyNameContainingIgnoreCase(String companyName);
    List<DeliveryModel> findByUserId(Long userId);

    @Query("SELECT d FROM DeliveryModel d WHERE " +
            "(:companyName IS NULL OR LOWER(d.companyName) LIKE LOWER(CONCAT('%', :companyName, '%'))) AND " +
            "(:documentNumber IS NULL OR d.documentNumber = :documentNumber) AND " +
            "(:startDate IS NULL OR d.scheduledDate >= :startDate) AND " +
            "(:endDate IS NULL OR d.scheduledDate <= :endDate) AND " +
            "(:city IS NULL OR LOWER(d.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
            "(:state IS NULL OR LOWER(d.state) LIKE LOWER(CONCAT('%', :state, '%')))")
    List<DeliveryModel> findWithFilters(
            @Param("companyName") String companyName,
            @Param("documentNumber") String documentNumber,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("city") String city,
            @Param("state") String state
    );
}

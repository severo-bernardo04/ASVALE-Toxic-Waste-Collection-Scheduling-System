package com.asvale.service;

import com.asvale.dto.DeliveryDTO;
import com.asvale.enums.DeliveryStatus;
import com.asvale.enums.UserType;
import com.asvale.exception.BusinessException;
import com.asvale.model.DeliveryModel;
import com.asvale.model.UserModel;
import com.asvale.repository.DeliveryRepository;
import com.asvale.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;

    @Transactional
    public DeliveryDTO createDelivery(DeliveryDTO dto, Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        validateDeliveryData(dto);
        
        DeliveryModel delivery = new DeliveryModel();
        delivery.setUser(user);
        updateDeliveryFromDTO(delivery, dto);
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setPrice(dto.getPrice());
        
        delivery = deliveryRepository.save(delivery);
        return convertToDTO(delivery);
    }

    @Transactional
    public DeliveryDTO updateDelivery(Long id, DeliveryDTO dto, Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        DeliveryModel delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Entrega não encontrada"));

        if (!delivery.getUser().getId().equals(userId) && user.getUserType() != UserType.ADMIN) {
            throw new BusinessException("Você não tem permissão para editar esta entrega");
        }

        if (delivery.getStatus() == DeliveryStatus.COMPLETED || delivery.getStatus() == DeliveryStatus.CANCELLED) {
            throw new BusinessException("Não é possível editar uma entrega " + delivery.getStatus().getDescription().toLowerCase());
        }

        validateDeliveryData(dto);
        updateDeliveryFromDTO(delivery, dto);
        delivery = deliveryRepository.save(delivery);
        return convertToDTO(delivery);
    }

    @Transactional
    public DeliveryDTO updateStatus(Long id, DeliveryStatus newStatus, Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        DeliveryModel delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Entrega não encontrada"));

        if (user.getUserType() == UserType.USER) {
            if (newStatus != DeliveryStatus.CANCELLED) {
                throw new BusinessException("Usuário comum só pode cancelar entregas");
            }
            if (!delivery.getUser().getId().equals(userId)) {
                throw new BusinessException("Você só pode cancelar suas próprias entregas");
            }
        }

        validateStatusTransition(delivery.getStatus(), newStatus);
        delivery.setStatus(newStatus);
        delivery = deliveryRepository.save(delivery);
        return convertToDTO(delivery);
    }

    @Transactional(readOnly = true)
    public List<DeliveryDTO> getAllDeliveries(String documentNumber) {
        UserModel user = userRepository.findByDocumentNumber(documentNumber)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        List<DeliveryModel> deliveries;
        if (user.getUserType() == UserType.ADMIN) {
            deliveries = deliveryRepository.findAll();
        } else {
            deliveries = deliveryRepository.findByUserId(user.getId());
        }
        return deliveries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryDTO getDeliveryById(Long id, Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        DeliveryModel delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Entrega não encontrada"));

        if (user.getUserType() != UserType.ADMIN && !delivery.getUser().getId().equals(userId)) {
            throw new BusinessException("Você não tem permissão para visualizar esta entrega");
        }

        return convertToDTO(delivery);
    }

    public List<DeliveryDTO> searchDeliveries(String documentNumber, String producerCompany, String producerRegistration, Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));
        List<DeliveryModel> deliveries;
        if (user.getUserType() == UserType.ADMIN) {
            deliveries = deliveryRepository.findWithFilters(
                producerCompany,
                documentNumber,
                null,
                null,
                null,
                null
            );
        } else {
            deliveries = deliveryRepository.findWithFilters(
                producerCompany,
                documentNumber,
                null,
                null,
                null,
                null
            ).stream().filter(d -> d.getUser().getId().equals(userId)).collect(Collectors.toList());
        }
        return deliveries.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteDelivery(Long id, Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));
        DeliveryModel delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Entrega não encontrada"));
        if (user.getUserType() != UserType.ADMIN && !delivery.getUser().getId().equals(userId)) {
            throw new BusinessException("Você não tem permissão para deletar esta entrega");
        }
        deliveryRepository.delete(delivery);
    }

    private void validateStatusTransition(DeliveryStatus currentStatus, DeliveryStatus newStatus) {
        if (currentStatus == newStatus) {
            return;
        }

        switch (currentStatus) {
            case PENDING:
                break;
            case ACCEPTED:
                if (newStatus == DeliveryStatus.PENDING) {
                    throw new BusinessException("Não é possível voltar uma entrega aceita para pendente");
                }
                break;
            case COMPLETED:
            case CANCELLED:
                throw new BusinessException("Não é possível alterar o status de uma entrega " + 
                    currentStatus.getDescription().toLowerCase());
        }
    }

    private void validateDeliveryData(DeliveryDTO dto) {
        if (dto.getCompanyName() == null || dto.getCompanyName().trim().isEmpty()) {
            throw new BusinessException("Nome da empresa é obrigatório");
        }
        if (dto.getDocumentNumber() == null || dto.getDocumentNumber().trim().isEmpty()) {
            throw new BusinessException("CPF/CNPJ é obrigatório");
        }
        if (dto.getAddress() == null || dto.getAddress().trim().isEmpty()) {
            throw new BusinessException("Endereço é obrigatório");
        }
        if (dto.getCity() == null || dto.getCity().trim().isEmpty()) {
            throw new BusinessException("Cidade é obrigatória");
        }
        if (dto.getState() == null || dto.getState().trim().isEmpty()) {
            throw new BusinessException("Estado é obrigatório");
        }
        if (dto.getScheduledDate() == null) {
            throw new BusinessException("Data agendada é obrigatória");
        }
    }

    private void updateDeliveryFromDTO(DeliveryModel delivery, DeliveryDTO dto) {
        delivery.setCompanyName(dto.getCompanyName());
        delivery.setDocumentNumber(dto.getDocumentNumber());
        delivery.setAddress(dto.getAddress());
        delivery.setCity(dto.getCity());
        delivery.setState(dto.getState());
        delivery.setPhone(dto.getPhone());
        delivery.setScheduledDate(dto.getScheduledDate());
        delivery.setNotes(dto.getNotes());
        delivery.setMaterials(dto.getMaterials());
        delivery.setPrice(dto.getPrice());
    }

    private DeliveryDTO convertToDTO(DeliveryModel model) {
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(model.getId());
        dto.setUserId(model.getUser().getId());
        dto.setCompanyName(model.getCompanyName());
        dto.setDocumentNumber(model.getDocumentNumber());
        dto.setAddress(model.getAddress());
        dto.setCity(model.getCity());
        dto.setState(model.getState());
        dto.setPhone(model.getPhone());
        dto.setScheduledDate(model.getScheduledDate());
        dto.setNotes(model.getNotes());
        dto.setStatus(model.getStatus());
        dto.setMaterials(model.getMaterials());
        dto.setCreatedAt(model.getCreatedAt());
        dto.setUpdatedAt(model.getUpdatedAt());
        return dto;
    }
}

package com.asvale.service;

import com.asvale.dto.UserDTO;
import com.asvale.dto.UserLoginDTO;
import com.asvale.dto.UserRegistrationDTO;
import com.asvale.exception.BusinessException;
import com.asvale.model.UserModel;
import com.asvale.repository.UserRepository;
import com.asvale.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public Map<String, Object> register(UserRegistrationDTO registrationDTO) {
        if (userRepository.existsByDocumentNumber(registrationDTO.getDocumentNumber())) {
            throw new RuntimeException("CPF/CNPJ já cadastrado");
        }

        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        UserModel user = new UserModel();
        user.setName(registrationDTO.getName());
        user.setEmail(registrationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setDocumentNumber(registrationDTO.getDocumentNumber());
        user.setPhone(registrationDTO.getPhone());
        user.setUserType(com.asvale.enums.UserType.USER);

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Usuário registrado com sucesso");
        return response;
    }

    public Map<String, Object> login(UserLoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDTO.getDocumentNumber(), loginDTO.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        UserModel user = userRepository.findByDocumentNumber(loginDTO.getDocumentNumber())
            .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        UserDTO userDTO = convertToDTO(user);
        System.out.println("DTO gerado no login: " + userDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("type", "Bearer");
        response.put("user", userDTO);
        return response;
    }

    public UserDTO getUserById(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));
        return convertToDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        UserModel existingUser = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        if (userDTO.getName() != null) {
            existingUser.setName(userDTO.getName());
        }
        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                throw new BusinessException("Email já cadastrado");
            }
            existingUser.setEmail(userDTO.getEmail());
        }
        if (userDTO.getPassword() != null) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        if (userDTO.getPhone() != null) {
            existingUser.setPhone(userDTO.getPhone());
        }
        
        existingUser.setUpdatedAt(LocalDateTime.now());
        existingUser = userRepository.save(existingUser);
        
        return convertToDTO(existingUser);
    }

    @Transactional
    public void deactivateUser(Long id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO createAdmin(UserRegistrationDTO registrationDTO) {
        if (userRepository.existsByDocumentNumber(registrationDTO.getDocumentNumber())) {
            throw new BusinessException("CPF/CNPJ já cadastrado");
        }
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new BusinessException("E-mail já cadastrado");
        }
        UserModel user = new UserModel();
        user.setName(registrationDTO.getName());
        user.setEmail(registrationDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setDocumentNumber(registrationDTO.getDocumentNumber());
        user.setPhone(registrationDTO.getPhone());
        user.setUserType(com.asvale.enums.UserType.ADMIN);
        userRepository.save(user);
        return convertToDTO(user);
    }

    @Transactional
    public UserDTO updateUserRole(Long id, String userType) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));
        if (!"ADMIN".equals(userType) && !"USER".equals(userType)) {
            throw new BusinessException("Tipo de usuário inválido");
        }
        user.setUserType(com.asvale.enums.UserType.valueOf(userType));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return convertToDTO(user);
    }

    private void validateRegistrationData(UserRegistrationDTO registrationDTO) {
        if (registrationDTO.getName() == null || registrationDTO.getName().trim().isEmpty()) {
            throw new BusinessException("Nome é obrigatório");
        }
        if (registrationDTO.getEmail() == null || registrationDTO.getEmail().trim().isEmpty()) {
            throw new BusinessException("Email é obrigatório");
        }
        if (registrationDTO.getPassword() == null || registrationDTO.getPassword().trim().isEmpty()) {
            throw new BusinessException("Senha é obrigatória");
        }
        if (registrationDTO.getDocumentNumber() == null || registrationDTO.getDocumentNumber().trim().isEmpty()) {
            throw new BusinessException("CPF/CNPJ é obrigatório");
        }
    }

    private UserDTO convertToDTO(UserModel model) {
        UserDTO dto = new UserDTO();
        dto.setId(model.getId());
        dto.setName(model.getName());
        dto.setEmail(model.getEmail());
        dto.setDocumentNumber(model.getDocumentNumber());
        dto.setPhone(model.getPhone());
        dto.setUserType(model.getUserType());
        dto.setCreatedAt(model.getCreatedAt());
        dto.setUpdatedAt(model.getUpdatedAt());
        dto.setLastLogin(model.getLastLogin());
        dto.setActive(model.isActive());
        dto.setIsAdmin(model.getUserType() == com.asvale.enums.UserType.ADMIN);
        return dto;
    }
}

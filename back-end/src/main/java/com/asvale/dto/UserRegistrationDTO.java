package com.asvale.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegistrationDTO {
    @NotBlank(message = "O nome é obrigatório")
    private String name;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String password;

    @NotBlank(message = "O CPF/CNPJ é obrigatório")
    @Pattern(regexp = "^\\d{11}|\\d{14}$", message = "CPF/CNPJ inválido")
    private String documentNumber;

    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(regexp = "^\\d{10,11}$", message = "Telefone inválido")
    private String phone;
} 
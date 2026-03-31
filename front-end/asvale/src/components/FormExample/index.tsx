import React, { useState } from 'react';
import styled from 'styled-components';
import MaskedInput from '../MaskedInput';

const FormContainer = styled.form`
  max-width: 500px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }

  .error-message {
    color: ${({ theme }) => theme.colors.error};
    font-size: ${({ theme }) => theme.fontSize.sm};
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray.medium};
    cursor: not-allowed;
  }
`;

interface FormData {
  cpf: string;
  cnpj: string;
  phone: string;
  cep: string;
  birthDate: string;
}

interface FormErrors {
  [key: string]: string;
}

const FormExample: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    cpf: '',
    cnpj: '',
    phone: '',
    cep: '',
    birthDate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }

    if (formData.cnpj && formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ inválido';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        newErrors.phone = 'Telefone inválido';
      }
    }

    if (!formData.cep) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (formData.cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = 'CEP inválido';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else {
      const [day, month, year] = formData.birthDate.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const today = new Date();
      
      if (
        !date ||
        date > today ||
        year < 1900 ||
        month < 1 || month > 12 ||
        day < 1 || day > 31
      ) {
        newErrors.birthDate = 'Data de nascimento inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <label>CPF *</label>
        <MaskedInput
          type="cpf"
          value={formData.cpf}
          onChange={handleChange('cpf')}
          placeholder="000.000.000-00"
          required
        />
        {errors.cpf && <div className="error-message">{errors.cpf}</div>}
      </FormGroup>

      <FormGroup>
        <label>CNPJ</label>
        <MaskedInput
          type="cnpj"
          value={formData.cnpj}
          onChange={handleChange('cnpj')}
          placeholder="00.000.000/0000-00"
        />
        {errors.cnpj && <div className="error-message">{errors.cnpj}</div>}
      </FormGroup>

      <FormGroup>
        <label>Telefone *</label>
        <MaskedInput
          type="phone"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="(00) 00000-0000"
          required
        />
        {errors.phone && <div className="error-message">{errors.phone}</div>}
      </FormGroup>

      <FormGroup>
        <label>CEP *</label>
        <MaskedInput
          type="cep"
          value={formData.cep}
          onChange={handleChange('cep')}
          placeholder="00000-000"
          required
        />
        {errors.cep && <div className="error-message">{errors.cep}</div>}
      </FormGroup>

      <FormGroup>
        <label>Data de Nascimento *</label>
        <MaskedInput
          type="date"
          value={formData.birthDate}
          onChange={handleChange('birthDate')}
          placeholder="DD/MM/AAAA"
          required
        />
        {errors.birthDate && <div className="error-message">{errors.birthDate}</div>}
      </FormGroup>

      <SubmitButton type="submit">
        Enviar
      </SubmitButton>
    </FormContainer>
  );
};

export default FormExample; 
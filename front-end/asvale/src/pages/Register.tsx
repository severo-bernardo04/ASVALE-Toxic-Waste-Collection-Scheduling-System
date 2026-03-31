import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MaskedInput from '../components/MaskedInput/MaskedInput';
import PasswordInput from '../components/Form/PasswordInput';
import { MASKS, validateCPF, validateCNPJ } from '../utils/masks';
import api from '../services/api';

interface RegisterFormData {
  name: string;
  documentNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    documentNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'CPF/CNPJ é obrigatório';
    } else {
      const cleanDoc = formData.documentNumber.replace(/[^\d]/g, '');
      if (cleanDoc.length <= 11) {
        if (!validateCPF(formData.documentNumber)) {
          newErrors.documentNumber = 'CPF inválido';
        }
      } else {
        if (!validateCNPJ(formData.documentNumber)) {
          newErrors.documentNumber = 'CNPJ inválido';
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'A senha deve ter no mínimo 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (validateForm()) {
      try {
        await api.post('/api/auth/register', {
          name: formData.name,
          documentNumber: formData.documentNumber.replace(/[^\d]/g, ''),
          email: formData.email,
          password: formData.password
        });
        navigate('/login');
      } catch (error: any) {
        setApiError(error.response?.data?.message || 'Erro ao realizar cadastro');
      }
    }
  };

  const handleChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <Container className="mt-5">
      <div className="mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Cadastro</h2>
        {apiError && (
          <Alert variant="danger" className="mb-4">
            {apiError}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <MaskedInput
            mask={formData.documentNumber.replace(/[^\d]/g, '').length <= 11 ? MASKS.CPF : MASKS.CNPJ}
            value={formData.documentNumber}
            onChange={handleChange('documentNumber')}
            label="CPF/CNPJ"
            required
            isInvalid={!!errors.documentNumber}
            feedback={errors.documentNumber}
          />

          <Form.Group className="mb-3">
            <Form.Label>E-mail<span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <PasswordInput
            value={formData.password}
            onChange={handleChange('password')}
            label="Senha"
            required
            isInvalid={!!errors.password}
            feedback={errors.password}
            showStrengthMeter
          />

          <PasswordInput
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            label="Confirmar Senha"
            required
            isInvalid={!!errors.confirmPassword}
            feedback={errors.confirmPassword}
          />

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Cadastrar
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/login')}>
              Já tenho uma conta
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Register; 
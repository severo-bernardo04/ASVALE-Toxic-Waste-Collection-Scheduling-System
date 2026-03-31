import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Form, FormField, Button } from '../../../components/Form';
import MaskedInput from '../../../components/MaskedInput';
import PasswordInput from '../../../components/Form/PasswordInput';
import {
  Container,
  Content,
  Title,
  Subtitle,
  LoginLink,
} from './styles';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  documentNumber: string;
  phone: string;
  documentType: 'cpf' | 'cnpj';
}

interface FormErrors {
  [key: string]: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    documentNumber: '',
    phone: '',
    documentType: 'cpf',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!formData.documentNumber) {
      newErrors.documentNumber = 'CPF/CNPJ é obrigatório';
    } else {
      const numericDocument = formData.documentNumber.replace(/\D/g, '');
      if (formData.documentType === 'cpf' && numericDocument.length !== 11) {
        newErrors.documentNumber = 'CPF inválido';
      } else if (formData.documentType === 'cnpj' && numericDocument.length !== 14) {
        newErrors.documentNumber = 'CNPJ inválido';
      }
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else {
      const numericPhone = formData.phone.replace(/\D/g, '');
      if (numericPhone.length < 10 || numericPhone.length > 11) {
        newErrors.phone = 'Telefone inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, documentType, ...registrationData } = formData;
      await signUp({
        ...registrationData,
        documentNumber: registrationData.documentNumber.replace(/\D/g, ''),
        phone: registrationData.phone.replace(/\D/g, ''),
      });
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        email: 'Erro ao criar conta. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMaskedChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));

    if (field === 'documentNumber') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 11) {
        setFormData(prev => ({ ...prev, documentType: 'cnpj' }));
      } else {
        setFormData(prev => ({ ...prev, documentType: 'cpf' }));
      }
    }
  };

  return (
    <Container>
      <Content>
        <Title>Criar Conta</Title>
        <Subtitle>Preencha os dados para se cadastrar</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormField
            label="Nome"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Seu nome completo"
            required
          />
          <FormField
            label="E-mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="seu@email.com"
            required
          />
          <PasswordInput
            value={formData.password}
            onChange={(e) => handleChange({ target: { name: 'password', value: e.target.value } } as any)}
            label="Senha"
            required
            isInvalid={!!errors.password}
            feedback={errors.password}
            showStrengthMeter
          />
          <PasswordInput
            value={formData.confirmPassword}
            onChange={(e) => handleChange({ target: { name: 'confirmPassword', value: e.target.value } } as any)}
            label="Confirmar Senha"
            required
            isInvalid={!!errors.confirmPassword}
            feedback={errors.confirmPassword}
          />
          <MaskedInput
            type={formData.documentType}
            value={formData.documentNumber}
            onChange={handleMaskedChange('documentNumber')}
            placeholder={formData.documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
            required
            isInvalid={!!errors.documentNumber}
            feedback={errors.documentNumber}
          />
          <MaskedInput
            type="phone"
            value={formData.phone}
            onChange={handleMaskedChange('phone')}
            placeholder="(00) 00000-0000"
            required
            isInvalid={!!errors.phone}
            feedback={errors.phone}
          />
          <Button type="submit" isLoading={isLoading}>
            Criar Conta
          </Button>
        </Form>

        <LoginLink>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </LoginLink>
      </Content>
    </Container>
  );
};

export default Register; 
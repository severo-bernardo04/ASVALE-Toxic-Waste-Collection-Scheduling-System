import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Form, FormField, Button } from '../../../components/Form';
import {
  Container,
  Content,
  Title,
  Subtitle,
  RegisterLink,
} from './styles';
import MaskedInput from '../../../components/MaskedInput';
import PasswordInput from '../../../components/Form/PasswordInput';

interface FormData {
  documentNumber: string;
  password: string;
}

interface FormErrors {
  documentNumber?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    documentNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.documentNumber) {
      newErrors.documentNumber = 'CPF/CNPJ é obrigatório';
    } else {
      const numericDoc = formData.documentNumber.replace(/\D/g, '');
      if (numericDoc.length !== 11 && numericDoc.length !== 14) {
        newErrors.documentNumber = 'CPF/CNPJ inválido';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signIn({
        documentNumber: formData.documentNumber.replace(/\D/g, ''),
        password: formData.password
      });
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        documentNumber: 'Credenciais inválidas',
        password: 'Credenciais inválidas',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <Container>
      <Content>
        <Title>Bem-vindo de volta!</Title>
        <Subtitle>Faça login para acessar sua conta</Subtitle>

        <Form onSubmit={handleSubmit}>
          <MaskedInput
            type="cpf"
            value={formData.documentNumber}
            onChange={(value) => handleChange(value, 'documentNumber')}
            placeholder="Seu CPF ou CNPJ"
            required
            isInvalid={!!errors?.documentNumber}
            feedback={errors?.documentNumber}
          />

          <PasswordInput
            value={formData.password}
            onChange={(e) => handleChange(e.target.value, 'password')}
            label="Senha"
            required
            isInvalid={!!errors?.password}
            feedback={errors?.password}
          />

          <Button type="submit" isLoading={isLoading}>
            Entrar
          </Button>
        </Form>

        <RegisterLink>
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </RegisterLink>
      </Content>
    </Container>
  );
};

export default Login; 
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Form, FormField, Button } from '../../components/Form';
import MaskedInput from '../../components/MaskedInput';
import PasswordInput from '../../components/Form/PasswordInput';
import { Container, Content, Title, LoginLink } from './styles';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    documentNumber: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    documentNumber: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string, name?: string) => {
    if (typeof e === 'string' && name) {
      setFormData((prev) => ({ ...prev, [name]: e }));
    } else if (typeof e !== 'string') {
      const { name: inputName, value } = e.target;
      setFormData((prev) => ({ ...prev, [inputName]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        documentNumber: formData.documentNumber.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Cadastro</Title>
        <Form onSubmit={handleSubmit}>
          <FormField
            label="Nome"
            name="name"
            type="text"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Seu email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <PasswordInput
            value={formData.password}
            onChange={(e) => handleChange(e)}
            label="Senha"
            required
          />
          <MaskedInput
            type={formData.documentNumber.replace(/\D/g, '').length > 11 ? 'cnpj' : 'cpf'}
            value={formData.documentNumber}
            onChange={(value) => handleChange(value, 'documentNumber')}
            placeholder="Seu CPF ou CNPJ"
            required
            isInvalid={!!errors?.documentNumber}
            feedback={errors?.documentNumber}
          />
          <MaskedInput
            type="phone"
            value={formData.phone}
            onChange={(value) => handleChange(value, 'phone')}
            placeholder="Seu telefone"
            required
            isInvalid={!!errors?.phone}
            feedback={errors?.phone}
          />
          <Button type="submit" isLoading={loading}>
            Cadastrar
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
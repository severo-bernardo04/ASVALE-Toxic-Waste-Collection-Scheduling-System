import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Form, FormField, Button } from '../../components/Form';
import MaskedInput from '../../components/MaskedInput';
import PasswordInput from '../../components/Form/PasswordInput';
import { Container, Content, Title, RegisterLink } from './styles';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    documentNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    documentNumber: '',
    password: '',
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
      await signIn({
        documentNumber: formData.documentNumber.replace(/\D/g, ''),
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <MaskedInput
            type="cpf"
            value={formData.documentNumber}
            onChange={(value) => handleChange(value, 'documentNumber')}
            placeholder="CPF"
            required
            isInvalid={!!errors?.documentNumber}
            feedback={errors?.documentNumber}
          />
          <PasswordInput
            value={formData.password}
            onChange={(e) => handleChange(e)}
            label="Senha"
            required
            isInvalid={!!errors?.password}
            feedback={errors?.password}
          />
          <Button type="submit" isLoading={loading}>
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
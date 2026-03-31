import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/Form/PasswordInput';
import api from '../services/api';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (validateForm()) {
      try {
        const response = await api.post('/api/auth/login', formData);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } catch (error: any) {
        setApiError(error.response?.data?.message || 'E-mail ou senha inválidos');
      }
    }
  };

  const handleChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <Container className="mt-5">
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {apiError && (
          <Alert variant="danger" className="mb-4">
            {apiError}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
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
          />

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Entrar
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate('/register')}>
              Criar uma conta
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login; 
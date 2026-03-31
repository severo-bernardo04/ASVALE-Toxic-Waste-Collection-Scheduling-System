import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Container,
  Header,
  Title,
  Content,
  Section,
  SectionTitle,
  Grid,
  Card,
  CardHeader,
  CardContent,
  StatusBadge,
  ActionButtons,
  Button,
} from './styles';
import { FaCheck, FaTimes, FaBoxOpen, FaUserEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router-dom';

interface Delivery {
  id: number;
  companyName: string;
  documentNumber: string;
  address: string;
  city: string;
  state: string;
  scheduledDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  phone: string;
  notes: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const response = await api.get('/api/deliveries');
      console.log('Entregas atualizadas:', response.data);
      setDeliveries(response.data);
    } catch (error) {
      toast.error('Erro ao carregar entregas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: Delivery['status']) => {
    try {
      await api.put(`/api/deliveries/${id}/status`, { status: newStatus });
      toast.success('Status atualizado com sucesso');
      loadDeliveries();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status: Delivery['status']) => {
    const colors = {
      PENDING: '#f1c40f',
      ACCEPTED: '#3498db',
      COMPLETED: '#2ecc71',
      CANCELLED: '#e74c3c',
    };
    return colors[status];
  };

  const getStatusText = (status: Delivery['status']) => {
    const texts = {
      PENDING: 'Pendente',
      ACCEPTED: 'Aceita',
      COMPLETED: 'Concluída',
      CANCELLED: 'Cancelada',
    };
    return texts[status];
  };

  return (
    <Container>
      <Header>
        <Title>Dashboard Administrativo</Title>
      </Header>

      <Content>
        <Section>
          <SectionTitle>Entregas</SectionTitle>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <Grid>
              {deliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardHeader>
                    <h3>Entrega</h3>
                    <StatusBadge color={getStatusColor(delivery.status)}>
                      {getStatusText(delivery.status)}
                    </StatusBadge>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Data:</strong>{' '}
                      {format(new Date(delivery.scheduledDate), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                    <p>
                      <strong>Empresa:</strong> {delivery.companyName}
                    </p>
                    <p>
                      <strong>CPF/CNPJ:</strong> {delivery.documentNumber}
                    </p>
                    <p>
                      <strong>Endereço:</strong> {delivery.address}, {delivery.city} - {delivery.state}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {delivery.phone}
                    </p>
                    {delivery.notes && (
                      <p>
                        <strong>Observações:</strong> {delivery.notes}
                      </p>
                    )}
                    {delivery.status !== 'COMPLETED' && delivery.status !== 'CANCELLED' && (
                      <ActionButtons>
                        {delivery.status === 'PENDING' && (
                          <Button
                            onClick={() => handleStatusUpdate(delivery.id, 'ACCEPTED')}
                            title="Marcar como aceita"
                            variant="success"
                          >
                            <FaCheck />
                          </Button>
                        )}
                        {delivery.status === 'ACCEPTED' && (
                          <Button
                            onClick={() => handleStatusUpdate(delivery.id, 'COMPLETED')}
                            title="Marcar como entregue"
                            variant="success"
                          >
                            <FaBoxOpen />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleStatusUpdate(delivery.id, 'CANCELLED')}
                          title="Cancelar entrega"
                          variant="danger"
                        >
                          <FaTimes />
                        </Button>
                      </ActionButtons>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )}
        </Section>
      </Content>

      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 40,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => navigate('/admin/users')}
          style={{
            background: '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            fontSize: 22,
            boxShadow: '0 2px 8px rgba(39,174,96,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          title="Editar Usuários"
        >
          <FaUserEdit />
        </button>
      </div>
    </Container>
  );
};

export default AdminDashboard; 
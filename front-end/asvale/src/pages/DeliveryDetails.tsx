import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import { FaEdit, FaPlus } from 'react-icons/fa';

interface Delivery {
  id: number;
  companyName: string;
  documentNumber: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  scheduledDate: string;
  notes: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  plasticBottles?: number;
  metalCans?: number;
  cardboardBoxes?: number;
  flexiblePackaging?: number;
  others?: number;
  isWashed?: boolean;
}

const DeliveryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDelivery();
  }, [id]);

  const loadDelivery = async () => {
    try {
      const response = await api.get(`/deliveries/${id}`);
      setDelivery(response.data);
    } catch (error) {
      console.error('Erro ao carregar entrega:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'ACCEPTED': return 'Aceita';
      case 'COMPLETED': return 'Concluída';
      case 'CANCELLED': return 'Cancelada';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <p>Carregando...</p>
      </Container>
    );
  }

  if (!delivery) {
    return (
      <Container className="mt-4">
        <p>Entrega não encontrada.</p>
      </Container>
    );
  }

  console.log('Renderizando DeliveryDetails');

  return (
    <Container className="mt-4" style={{ position: 'relative', minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalhes da Entrega</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="outline-secondary" onClick={() => navigate('/deliveries')}>
            Voltar
          </Button>
          <Button
            variant="success"
            style={{ display: 'flex', alignItems: 'center', fontWeight: 700, borderRadius: 8, padding: '8px 22px', boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}
            onClick={() => navigate(`/deliveries/edit/${delivery.id}`)}
          >
            <FaEdit style={{ marginRight: 8 }} /> Editar
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Informações Gerais</h5>
            <Badge bg={getStatusBadgeVariant(delivery.status)}>
              {getStatusText(delivery.status)}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Empresa:</strong> {delivery.companyName}</p>
              <p><strong>CPF/CNPJ:</strong> {delivery.documentNumber}</p>
              <p><strong>Telefone:</strong> {delivery.phone || 'Não informado'}</p>
            </Col>
            <Col md={6}>
              <p><strong>Data Agendada:</strong> {format(new Date(delivery.scheduledDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Endereço</h5>
        </Card.Header>
        <Card.Body>
          <p>{delivery.address}</p>
          <p>{delivery.city} - {delivery.state}</p>
        </Card.Body>
      </Card>

      {delivery.notes && (
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Observações</h5>
          </Card.Header>
          <Card.Body>
            <p>{delivery.notes}</p>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header>
          <h5 className="mb-0">Materiais</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Quantidades:</h6>
              <ul>
                {delivery.plasticBottles && <li>Garrafas Plásticas: {delivery.plasticBottles}</li>}
                {delivery.metalCans && <li>Latas de Metal: {delivery.metalCans}</li>}
                {delivery.cardboardBoxes && <li>Caixas de Papelão: {delivery.cardboardBoxes}</li>}
                {delivery.flexiblePackaging && <li>Embalagens Flexíveis: {delivery.flexiblePackaging}</li>}
                {delivery.others && <li>Outros: {delivery.others}</li>}
              </ul>
            </Col>
            <Col md={6}>
              <p><strong>Material Lavado:</strong> {delivery.isWashed ? 'Sim' : 'Não'}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <button
        style={{
          position: 'fixed',
          right: 32,
          bottom: 32,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          borderRadius: 32,
          width: 'auto',
          height: 64,
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(39,174,96,0.25)',
          background: '#27ae60',
          border: '4px solid #fff',
          fontSize: 22,
          padding: '0 28px',
          color: '#fff',
          cursor: 'pointer',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onClick={() => navigate('/deliveries/new')}
        title="Nova Entrega"
        onMouseOver={e => e.currentTarget.style.background = '#219150'}
        onMouseOut={e => e.currentTarget.style.background = '#27ae60'}
      >
        <FaPlus style={{ marginRight: 14, fontSize: 28 }} /> Nova Entrega
      </button>
    </Container>
  );
};

export default DeliveryDetails; 
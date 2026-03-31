import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import { FaPlus, FaBoxOpen, FaEdit } from 'react-icons/fa';

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

const DeliveryList: React.FC = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const response = await api.get('/api/deliveries');
      setDeliveries(response.data);
    } catch (error) {
      console.error('Erro ao carregar entregas:', error);
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

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  console.log('Renderizando DeliveryList');

  return (
    <Container className="with-navbar-padding mt-4" style={{ position: 'relative', minHeight: '80vh', paddingBottom: 120 }}>
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 style={{ color: '#27ae60', fontWeight: 800 }}>Minhas Entregas</h2>
        </div>

        {deliveries.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(39,174,96,0.08)', padding: 48, maxWidth: 500, margin: '48px auto', textAlign: 'center', color: '#888' }}>
            <FaBoxOpen size={48} style={{ marginBottom: 16, color: '#27ae60' }} />
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Nenhuma entrega encontrada</div>
            <div style={{ fontSize: 16, marginBottom: 24 }}>Clique no botão <b>Nova Entrega</b> para cadastrar sua primeira entrega!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 24, maxWidth: 600, margin: '0 auto' }}>
            {deliveries.map(delivery => (
              <div key={delivery.id} style={{
                background: '#fff',
                borderRadius: 32,
                boxShadow: '0 4px 24px rgba(39,174,96,0.10)',
                border: '2px solid #e0f5ea',
                padding: 36,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 16,
                textAlign: 'left',
                transition: 'box-shadow 0.2s',
              }}>
                <div style={{ fontWeight: 800, fontSize: 24, color: '#27ae60', marginBottom: 8 }}>{delivery.companyName}</div>
                <div style={{ fontWeight: 600, color: '#888', marginBottom: 4 }}><b>Status:</b> {delivery.status}</div>
                <div style={{ fontWeight: 500 }}><b>Data:</b> {new Date(delivery.scheduledDate).toLocaleDateString('pt-BR')}</div>
                <div style={{ fontWeight: 500 }}><b>Endereço:</b> {delivery.address}, {delivery.city} - {delivery.state}</div>
                <div style={{ fontWeight: 500 }}><b>Telefone:</b> {delivery.phone}</div>
                <div style={{ fontWeight: 500 }}><b>Observações:</b> {delivery.notes || '-'}</div>
                <button
                  onClick={() => navigate(`/deliveries/edit/${delivery.id}`)}
                  style={{ marginTop: 18, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,174,96,0.10)', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <FaEdit /> Editar
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          style={{
            position: 'absolute',
            right: 32,
            bottom: 32,
            zIndex: 99,
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
      </>
    </Container>
  );
};

export default DeliveryList; 
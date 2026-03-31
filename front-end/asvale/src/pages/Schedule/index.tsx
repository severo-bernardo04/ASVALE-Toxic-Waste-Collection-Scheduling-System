import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 16px 0 16px;
  margin-top: 96px;
`;
const Title = styled.h1`
  color: #27ae60;
  font-size: 2rem;
  margin-bottom: 32px;
`;
const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Status = styled.span<{ color: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  background: ${({ color }) => color};
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: 8px;
`;
const NewButton = styled.button`
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 32px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(39,174,96,0.10);
  transition: background 0.2s;
  &:hover { background: #219150; }
`;

interface Schedule {
  id: number;
  type: 'DELIVERY' | 'COLLECTION';
  scheduledDate: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  producerName: string;
  address: string;
  city: string;
  state: string;
}

const statusColors = {
  PENDING: '#f1c40f',
  CONFIRMED: '#3498db',
  COMPLETED: '#2ecc71',
  CANCELLED: '#e74c3c',
};
const statusText = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};
const timeSlots = {
  SLOT_08_10: '08:00 - 10:00',
  SLOT_10_12: '10:00 - 12:00',
  SLOT_14_16: '14:00 - 16:00',
  SLOT_16_18: '16:00 - 18:00',
};

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/deliveries')
      .then(res => setSchedules(res.data))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Title>Meus Agendamentos</Title>
      <NewButton onClick={() => navigate('/deliveries/new')}>Nova Entrega</NewButton>
      {loading ? <p>Carregando...</p> : (
        schedules.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 40, maxWidth: 800, margin: '32px auto 0 auto' }}>
            <div style={{ marginBottom: 24 }}>
              Você ainda não possui agendamentos.<br />
              Clique no botão abaixo para criar um novo.
            </div>
            <NewButton onClick={() => navigate('/deliveries/new')}>Nova Entrega</NewButton>
          </div>
        ) : (
          <CardList>
            {schedules.map(s => (
              <Card key={s.id}>
                <h3 style={{ color: '#27ae60', marginBottom: 4 }}>{s.type === 'DELIVERY' ? 'Entrega' : 'Coleta'}</h3>
                <div><strong>Data:</strong> {format(new Date(s.scheduledDate), "dd 'de' MMMM 'de' yyyy")}</div>
                <div><strong>Horário:</strong> {timeSlots[s.timeSlot as keyof typeof timeSlots] || s.timeSlot}</div>
                <div><strong>Produtor:</strong> {s.producerName}</div>
                <div><strong>Endereço:</strong> {s.address}</div>
                <div><strong>Cidade/Estado:</strong> {s.city}/{s.state}</div>
                <Status color={statusColors[s.status]}>{statusText[s.status]}</Status>
              </Card>
            ))}
          </CardList>
        )
      )}
    </Container>
  );
};

export default SchedulePage; 
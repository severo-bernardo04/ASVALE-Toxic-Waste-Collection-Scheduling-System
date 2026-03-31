import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Container, Header, Title, Content, Section, SectionTitle, Grid, Card } from './styles';
import { Pie, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

interface Schedule {
  id: number;
  type: 'DELIVERY' | 'COLLECTION';
  scheduledDate: string;
  timeSlot: string;
  status: 'PENDING' | 'ACCEPTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/deliveries')
      .then(res => setSchedules(res.data))
      .finally(() => setLoading(false));
  }, []);

  const total = schedules.length;
  const completed = schedules.filter(s => s.status === 'COMPLETED').length;
  const pending = schedules.filter(s => s.status === 'PENDING').length;
  const confirmed = schedules.filter(s => s.status === 'ACCEPTED' || s.status === 'CONFIRMED').length;
  const cancelled = schedules.filter(s => s.status === 'CANCELLED').length;

  const pieData = {
    labels: ['Concluídas', 'Pendentes', 'Confirmadas', 'Canceladas'],
    datasets: [
      {
        data: [completed, pending, confirmed, cancelled],
        backgroundColor: ['#2ecc71', '#f1c40f', '#3498db', '#e74c3c'],
        borderWidth: 1,
      },
    ],
  };

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const deliveriesByMonth = Array(12).fill(0);
  schedules.forEach(s => {
    const date = new Date(s.scheduledDate);
    deliveriesByMonth[date.getMonth()]++;
  });
  const lineData = {
    labels: months,
    datasets: [
      {
        label: 'Entregas por mês',
        data: deliveriesByMonth,
        fill: false,
        borderColor: '#27ae60',
        backgroundColor: '#27ae60',
        tension: 0.3,
      },
    ],
  };

  return (
    <Container className="with-navbar-padding">
      <Header>
        <Title>Dashboard Analítico</Title>
        <button onClick={() => navigate('/deliveries/new')} style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,174,96,0.10)', display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}><FaPlus /> Nova Entrega</button>
      </Header>
      <Content>
        <Section>
          <SectionTitle>Resumo</SectionTitle>
          <Grid style={{ gap: '2rem' }}>
            <Card style={{ background: '#27ae60', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 22, textAlign: 'center', padding: 24 }}>Total de Entregas<br /><span style={{ fontSize: 36 }}>{total}</span></Card>
            <Card style={{ background: '#2ecc71', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 22, textAlign: 'center', padding: 24 }}>Concluídas<br /><span style={{ fontSize: 36 }}>{completed}</span></Card>
            <Card style={{ background: '#3498db', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 22, textAlign: 'center', padding: 24 }}>Confirmadas<br /><span style={{ fontSize: 36 }}>{confirmed}</span></Card>
            <Card style={{ background: '#f1c40f', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 22, textAlign: 'center', padding: 24 }}>Pendentes<br /><span style={{ fontSize: 36 }}>{pending}</span></Card>
            <Card style={{ background: '#e74c3c', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 22, textAlign: 'center', padding: 24 }}>Canceladas<br /><span style={{ fontSize: 36 }}>{cancelled}</span></Card>
            </Grid>
        </Section>
        <Section style={{ marginTop: 48 }}>
          <SectionTitle>Distribuição de Status</SectionTitle>
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <Pie data={pieData} />
          </div>
        </Section>
        <Section style={{ marginTop: 48 }}>
          <SectionTitle>Entregas por Mês</SectionTitle>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <Line data={lineData} />
          </div>
        </Section>
      </Content>
    </Container>
  );
};

export default Dashboard; 
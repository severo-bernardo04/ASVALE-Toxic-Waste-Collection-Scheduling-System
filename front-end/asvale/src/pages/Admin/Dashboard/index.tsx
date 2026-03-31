import React, { useState, useEffect } from 'react';
import { adminApi, Schedule } from '../../../services/api';
import { Form, FormField, Button } from '../../../components/Form';
import {
  Container,
  Content,
  Header,
  Title,
  Tabs,
  TabButton,
  SchedulesList,
  ScheduleCard,
  ScheduleHeader,
  ScheduleInfo,
  ScheduleType,
  ScheduleDate,
  ScheduleDescription,
  ScheduleStatus,
  ScheduleActions,
  UsersList,
  UserCard,
  UserInfo,
  UserName,
  UserEmail,
  UserCompany,
  SearchBar,
} from './styles';

type TabType = 'schedules' | 'users';

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  isAdmin: boolean;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('schedules');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'schedules') {
      fetchSchedules();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchSchedules = async () => {
    try {
      const response = await adminApi.listSchedules();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminApi.listUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: Schedule['status']) => {
    setIsLoading(true);
    try {
      await adminApi.updateScheduleStatus(id, status);
      await fetchSchedules();
    } catch (error) {
      console.error('Error updating schedule status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Schedule['status']) => {
    const colors = {
      PENDING: '#FFA500',
      CONFIRMED: '#4CAF50',
      COMPLETED: '#2196F3',
      CANCELLED: '#F44336',
    };
    return colors[status];
  };

  const getStatusText = (status: Schedule['status']) => {
    const texts = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado',
    };
    return texts[status];
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Content>
        <Header>
          <Title>Painel Administrativo</Title>
          <Tabs>
            <TabButton
              active={activeTab === 'schedules'}
              onClick={() => setActiveTab('schedules')}
            >
              Agendamentos
            </TabButton>
            <TabButton
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            >
              Usuários
            </TabButton>
          </Tabs>
        </Header>

        <SearchBar>
          <FormField
            label=""
            type="text"
            placeholder={`Pesquisar ${activeTab === 'schedules' ? 'agendamentos' : 'usuários'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        {activeTab === 'schedules' ? (
          <SchedulesList>
            {filteredSchedules.map((schedule) => (
              <ScheduleCard key={schedule.id}>
                <ScheduleHeader>
                  <ScheduleInfo>
                    <ScheduleType>
                      {schedule.type === 'COLLECTION' ? 'Coleta' : 'Entrega'}
                    </ScheduleType>
                    <ScheduleStatus color={getStatusColor(schedule.status)}>
                      {getStatusText(schedule.status)}
                    </ScheduleStatus>
                  </ScheduleInfo>
                  <UserName>{schedule.userName}</UserName>
                </ScheduleHeader>
                <ScheduleDate>
                  {new Date(schedule.date).toLocaleDateString()}
                </ScheduleDate>
                <ScheduleDescription>{schedule.description}</ScheduleDescription>
                <ScheduleActions>
                  {schedule.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => handleUpdateStatus(schedule.id, 'CONFIRMED')}
                        disabled={isLoading}
                      >
                        Confirmar
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(schedule.id, 'CANCELLED')}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  {schedule.status === 'CONFIRMED' && (
                    <Button
                      onClick={() => handleUpdateStatus(schedule.id, 'COMPLETED')}
                      disabled={isLoading}
                    >
                      Concluir
                    </Button>
                  )}
                </ScheduleActions>
              </ScheduleCard>
            ))}
          </SchedulesList>
        ) : (
          <UsersList>
            {filteredUsers.map((user) => (
              <UserCard key={user.id}>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                  <UserCompany>{user.company}</UserCompany>
                </UserInfo>
              </UserCard>
            ))}
          </UsersList>
        )}
      </Content>
    </Container>
  );
};

export default AdminDashboard; 
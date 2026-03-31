import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Container,
  ProfileSection,
  SchedulesSection,
  UserInfo,
  ScheduleList,
  ScheduleCard,
  ScheduleStatus,
  ActionButtons,
  Button,
  NoSchedules,
} from './styles';
import { FaEdit, FaTrash, FaCheck, FaUser, FaUserShield, FaIdCard, FaEnvelope, FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';

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

const Profile: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editDoc, setEditDoc] = useState(user?.documentNumber || '');
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await api.get('/api/deliveries');
      setSchedules(response.data);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: Schedule['status']) => {
    try {
      await api.put(`/api/schedules/${id}`, { status: newStatus });
      toast.success('Status atualizado com sucesso');
      loadSchedules();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await api.delete(`/api/schedules/${id}`);
        toast.success('Agendamento excluído com sucesso');
        loadSchedules();
      } catch (error) {
        toast.error('Erro ao excluir agendamento');
      }
    }
  };

  const formatTimeSlot = (timeSlot: string) => {
    const slots = {
      SLOT_08_10: '08:00 - 10:00',
      SLOT_10_12: '10:00 - 12:00',
      SLOT_14_16: '14:00 - 16:00',
      SLOT_16_18: '16:00 - 18:00',
    };
    return slots[timeSlot as keyof typeof slots] || timeSlot;
  };

  const getStatusColor = (status: Schedule['status']) => {
    const colors = {
      PENDING: '#f1c40f',
      CONFIRMED: '#3498db',
      COMPLETED: '#2ecc71',
      CANCELLED: '#e74c3c',
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

  const handleEditProfile = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditDoc(user?.documentNumber || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/api/users/${user?.id}`, {
        name: editName,
        email: editEmail,
        documentNumber: editDoc
      });
      toast.success('Perfil atualizado com sucesso!');
      const updatedUser = { ...user, name: editName, email: editEmail, documentNumber: editDoc };
      localStorage.setItem('@Asvale:user', JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erro ao atualizar perfil');
    }
    setIsEditOpen(false);
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    try {
      await api.put(`/api/users/${user?.id}`, {
        password: newPassword
      });
      toast.success('Senha alterada com sucesso!');
      setIsPasswordOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  return (
    <Container>
      <ProfileSection style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', marginBottom: 32 }}>
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: '#27ae60',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          color: '#fff',
          fontWeight: 700,
          marginBottom: 24,
          boxShadow: '0 4px 24px rgba(39,174,96,0.18)'
        }}>
          <FaUser size={80} />
        </div>
        <h1 style={{ fontWeight: 900, fontSize: 36, marginBottom: 8, color: '#222', letterSpacing: 0.5, textAlign: 'center' }}>{user?.name}</h1>
        <span style={{ color: '#27ae60', fontWeight: 700, fontSize: 22, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'center' }}>
          {user?.isAdmin ? <FaUserShield /> : <FaUser />} {user?.isAdmin ? 'Administrador' : 'Usuário'}
        </span>
        <UserInfo style={{ gap: 24, margin: '0 auto', width: '100%', maxWidth: 420 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 36px', minWidth: 260, boxShadow: '0 4px 20px rgba(39,174,96,0.10)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, width: '100%', justifyContent: 'flex-start' }}>
            <FaIdCard color="#27ae60" size={24} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ color: '#888', fontWeight: 700, fontSize: 15 }}>CPF:</span><br />
              <span style={{ color: '#222', fontWeight: 600, fontSize: 20 }}>{user?.documentNumber}</span>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 36px', minWidth: 260, boxShadow: '0 4px 20px rgba(39,174,96,0.10)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, width: '100%', justifyContent: 'flex-start' }}>
            <FaEnvelope color="#27ae60" size={24} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ color: '#888', fontWeight: 700, fontSize: 15 }}>Email:</span><br />
              <span style={{ color: '#222', fontWeight: 600, fontSize: 20 }}>{user?.email}</span>
            </div>
          </div>
          {user?.phone && (
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px 36px', minWidth: 260, boxShadow: '0 4px 20px rgba(39,174,96,0.10)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, width: '100%', justifyContent: 'flex-start' }}>
              <FaPhone color="#27ae60" size={24} />
              <div style={{ textAlign: 'left' }}>
                <span style={{ color: '#888', fontWeight: 700, fontSize: 15 }}>Telefone:</span><br />
                <span style={{ color: '#222', fontWeight: 600, fontSize: 20 }}>{user?.phone}</span>
              </div>
            </div>
          )}
        </UserInfo>
      </ProfileSection>

      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24 }}>
        <button onClick={handleEditProfile} style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}>Editar Perfil</button>
        <button onClick={() => navigate('/deliveries')} style={{ background: '#fff', color: '#27ae60', border: '2px solid #27ae60', borderRadius: 8, padding: '14px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}>Meus Agendamentos</button>
        <button onClick={() => setIsPasswordOpen(true)} style={{ background: '#fff', color: '#e67e22', border: '2px solid #e67e22', borderRadius: 8, padding: '14px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(230,126,34,0.10)' }}>Alterar Senha</button>
      </div>

      <ReactModal
        isOpen={isEditOpen}
        onRequestClose={() => setIsEditOpen(false)}
        style={{ overlay: { background: 'rgba(0,0,0,0.25)' }, content: { maxWidth: 420, margin: 'auto', borderRadius: 16, padding: 40, boxShadow: '0 8px 32px rgba(39,174,96,0.10)' } }}
        ariaHideApp={false}
      >
        <h2 style={{ color: '#27ae60', marginBottom: 32, textAlign: 'center', fontSize: 28, fontWeight: 800 }}>Editar Perfil</h2>
        <form onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>Nome</label>
            <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #b5e0c7', marginTop: 4, fontSize: 17, boxShadow: '0 2px 8px rgba(39,174,96,0.04)' }} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>Email</label>
            <input value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #b5e0c7', marginTop: 4, fontSize: 17, boxShadow: '0 2px 8px rgba(39,174,96,0.04)' }} />
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>CPF</label>
            <input value={editDoc} onChange={e => setEditDoc(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #b5e0c7', marginTop: 4, fontSize: 17, boxShadow: '0 2px 8px rgba(39,174,96,0.04)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <button type="button" onClick={() => setIsEditOpen(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}>Salvar</button>
          </div>
        </form>
      </ReactModal>
      <ReactModal
        isOpen={isPasswordOpen}
        onRequestClose={() => setIsPasswordOpen(false)}
        style={{ overlay: { background: 'rgba(0,0,0,0.25)' }, content: { maxWidth: 420, margin: 'auto', borderRadius: 16, padding: 40, boxShadow: '0 8px 32px rgba(230,126,34,0.10)' } }}
        ariaHideApp={false}
      >
        <h2 style={{ color: '#e67e22', marginBottom: 32, textAlign: 'center', fontSize: 28, fontWeight: 800 }}>Alterar Senha</h2>
        <form onSubmit={e => { e.preventDefault(); handleSavePassword(); }}>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>Senha Atual</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #f7c59f', marginTop: 4, fontSize: 17, boxShadow: '0 2px 8px rgba(230,126,34,0.04)' }} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>Nova Senha</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #f7c59f', marginTop: 4, fontSize: 17, boxShadow: '0 2px 8px rgba(230,126,34,0.04)' }} />
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, display: 'block' }}>Confirmar Nova Senha</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #f7c59f', marginTop: 4, fontSize: 17, boxShadow: '0 2px 8px rgba(230,126,34,0.04)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <button type="button" onClick={() => setIsPasswordOpen(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ background: '#e67e22', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(230,126,34,0.10)' }}>Salvar</button>
          </div>
        </form>
      </ReactModal>
    </Container>
  );
};

export default Profile; 
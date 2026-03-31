import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  email: string;
  documentNumber: string;
  phone: string;
  userType: 'USER' | 'ADMIN';
  active: boolean;
}

const UsersAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', active: true });
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id: number) => {
    try {
      await api.put(`/api/users/${id}/role`, { userType: 'ADMIN' });
      toast.success('Usuário promovido a admin!');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao promover usuário');
    }
  };

  const handleDemote = async (id: number) => {
    try {
      await api.put(`/api/users/${id}/role`, { userType: 'USER' });
      toast.success('Usuário rebaixado para comum!');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao rebaixar usuário');
    }
  };

  const handleEdit = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setEditingUser(user);
      setEditForm({ name: user.name, email: user.email, phone: user.phone, active: user.active });
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setEditForm(prev => ({
      ...prev,
      [name]: fieldValue
    }));
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    try {
      await api.put(`/api/users/${editingUser.id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        active: editForm.active
      });
      toast.success('Usuário atualizado!');
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, color: '#27ae60', fontWeight: 800 }}>Administração de Usuários</h1>
        <button onClick={() => navigate(-1)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>Voltar</button>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(39,174,96,0.10)', padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 17, minWidth: 900 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <tr style={{ background: '#f8f8f8', color: '#27ae60', fontWeight: 700 }}>
                <th style={{ padding: 16, position: 'sticky', top: 0, background: '#f8f8f8', zIndex: 2 }}>ID</th>
                <th style={{ padding: 16, position: 'sticky', top: 0, background: '#f8f8f8', zIndex: 2 }}>Nome</th>
                <th style={{ padding: 16, position: 'sticky', top: 0, background: '#f8f8f8', zIndex: 2 }}>Email</th>
                <th style={{ padding: 16, position: 'sticky', top: 0, background: '#f8f8f8', zIndex: 2 }}>CPF/CNPJ</th>
                <th style={{ padding: 16, position: 'sticky', top: 0, background: '#f8f8f8', zIndex: 2 }}>Telefone</th>
                <th style={{ padding: 16, position: 'sticky', top: 0, background: '#f8f8f8', zIndex: 2 }}>Tipo</th>
                <th style={{ padding: 16, position: 'sticky', top: 0, background: '#f8f8f8', zIndex: 2 }}>Status</th>
                <th style={{ padding: 16, position: 'sticky', top: 0, background: '#f8f8f8', zIndex: 2 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: idx % 2 === 0 ? '#f9fcfa' : '#fff',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#eafaf1')}
                  onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? '#f9fcfa' : '#fff')}
                >
                  <td style={{ padding: 14 }}>{user.id}</td>
                  <td style={{ padding: 14 }}>{user.name}</td>
                  <td style={{ padding: 14 }}>{user.email}</td>
                  <td style={{ padding: 14 }}>{user.documentNumber}</td>
                  <td style={{ padding: 14 }}>{user.phone}</td>
                  <td style={{ padding: 14 }}>
                    <span style={{ background: user.userType === 'ADMIN' ? '#27ae60' : '#bbb', color: '#fff', borderRadius: 6, padding: '2px 10px', fontWeight: 700, fontSize: 15 }}>
                      {user.userType === 'ADMIN' ? 'Admin' : 'Comum'}
                    </span>
                  </td>
                  <td style={{ padding: 14 }}>
                    <span style={{ background: user.active ? '#2ecc71' : '#e74c3c', color: '#fff', borderRadius: 6, padding: '2px 10px', fontWeight: 700, fontSize: 15 }}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: 14, display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEdit(user.id)} style={{ marginRight: 0, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FaEdit /> Editar
                    </button>
                    {user.userType === 'USER' ? (
                      <button onClick={() => handlePromote(user.id)} style={{ background: '#3498db', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', marginRight: 0 }}>Promover</button>
                    ) : (
                      <button onClick={() => handleDemote(user.id)} style={{ background: '#e67e22', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer', marginRight: 0 }}>Rebaixar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, minWidth: 340, boxShadow: '0 4px 24px rgba(39,174,96,0.15)', maxWidth: 380 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
              <FaUser size={48} color="#27ae60" style={{ marginBottom: 8 }} />
              <h2 style={{ color: '#27ae60', marginBottom: 0, fontWeight: 800, fontSize: 26 }}>Editar Usuário</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaUser color="#27ae60" />
                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} placeholder="Nome" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaEnvelope color="#27ae60" />
                <input type="email" name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaPhone color="#27ae60" />
                <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="Telefone" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <FaCheckCircle color={editForm.active ? '#27ae60' : '#bbb'} />
                <input type="checkbox" name="active" checked={editForm.active} onChange={handleEditChange} style={{ marginLeft: 4 }} /> Ativo
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setEditingUser(null)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>Cancelar</button>
              <button onClick={handleEditSave} style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin; 
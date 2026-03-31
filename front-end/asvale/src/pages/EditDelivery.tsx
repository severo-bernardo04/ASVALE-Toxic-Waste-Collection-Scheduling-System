import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaIndustry, FaIdCard, FaMapMarkerAlt, FaCity, FaFlag, FaPhone, FaCalendarAlt, FaBox, FaFlask, FaRecycle, FaCubes, FaQuestionCircle, FaWeight, FaCube, FaBoxes, FaClipboardList, FaCheckCircle, FaTimesCircle, FaPlus, FaMinus } from 'react-icons/fa';

interface DeliveryFormData {
  companyName: string;
  documentNumber: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  scheduledDate: string;
  notes: string;
}

const FormWrapper = styled.div`
  max-width: 1100px;
  margin: 48px auto 32px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 32px rgba(39,174,96,0.10);
  padding: 48px 48px 32px 48px;
  position: relative;
  z-index: 1;
`;
const Title = styled.h2`
  color: #27ae60;
  font-weight: 800;
  text-align: center;
  margin-bottom: 32px;
`;
const StyledForm = styled(Form)`
  .form-label {
    font-weight: 600;
    color: #222;
  }
  .form-control, textarea {
    border-radius: 10px;
    border: 1.5px solid #e0e0e0;
    font-size: 1.08rem;
    padding: 12px 14px;
    margin-bottom: 8px;
    background: #f9f9f9;
    transition: border 0.2s;
  }
  .form-control:focus {
    border-color: #27ae60;
    box-shadow: 0 0 0 2px rgba(39,174,96,0.10);
    background: #fff;
  }
  textarea.form-control {
    min-height: 80px;
    resize: vertical;
  }
  .btn-success {
    background: #27ae60;
    border: none;
    font-weight: 700;
    font-size: 1.1rem;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(39,174,96,0.10);
    margin-bottom: 8px;
  }
  .btn-outline-secondary {
    border-radius: 10px;
    font-weight: 600;
  }
`;
const SectionCard = styled.div`
  background: #f8fbf8;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(39,174,96,0.06);
  padding: 24px 20px 16px 20px;
  margin-bottom: 24px;
  border-left: 6px solid #27ae60;
`;
const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #27ae60;
  font-weight: 700;
  margin-bottom: 18px;
  font-size: 1.18rem;
`;
const Row = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 18px;
`;
const Field = styled.div`
  flex: 1 1 220px;
  min-width: 180px;
`;
const TypeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 1.08rem;
  transition: color 0.2s;
  &:hover {
    color: #27ae60;
  }
`;
const MATERIAL_STRUCTURE = [
  {
    category: 'Embalagens Lavadas',
    icon: <FaCheckCircle />,
    types: [
      { name: 'Plásticas', icon: <FaFlask />, volumes: ['1L', '5L', '10L', '20L', 'ML', 'GR', 'KG'] },
      { name: 'Metálicas', icon: <FaCubes />, volumes: ['1L', '5L', '10L', '20L', 'ML', 'GR', 'KG'] },
    ],
  },
  {
    category: 'Laváveis Não Lavadas',
    icon: <FaRecycle />,
    types: [
      { name: 'Plásticas', icon: <FaFlask />, volumes: ['1L', '5L', '10L', '20L', 'ML', 'GR', 'KG'] },
      { name: 'Metálicas', icon: <FaCubes />, volumes: ['1L', '5L', '10L', '20L', 'ML', 'GR', 'KG'] },
    ],
  },
  {
    category: 'Não Laváveis Rígidas',
    icon: <FaCube />,
    types: [
      { name: 'Plásticas', icon: <FaFlask />, volumes: ['1L', '5L', '10L', '20L', 'ML', 'GR', 'KG'] },
      { name: 'Metálicas', icon: <FaCubes />, volumes: ['1L', '5L', '10L', '20L', 'ML', 'GR', 'KG'] },
      { name: 'Alumínio', icon: <FaBox />, volumes: ['1L', '5L', '10L', '20L', 'ML', 'GR', 'KG'] },
    ],
  },
  {
    category: 'Impróprias',
    icon: <FaTimesCircle />,
    types: [
      { name: 'Impróprias', icon: <FaQuestionCircle />, volumes: ['1L', '5L', '10L', '20L', 'ML', 'GR', 'KG'] },
    ],
  },
  {
    category: 'Outras Embalagens',
    icon: <FaClipboardList />,
    types: [
      { name: 'Plásticas Flexíveis', icon: <FaFlask />, volumes: ['UN', 'KG'] },
      { name: 'Papelão', icon: <FaBoxes />, volumes: ['UN', 'KG'] },
      { name: 'Tampas', icon: <FaBox />, volumes: ['UN', 'KG'] },
    ],
  },
];
const MainFieldsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 36px;
  margin-bottom: 24px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const MainField = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8fbf8;
  border-radius: 12px;
  padding: 18px 20px 10px 20px;
  box-shadow: 0 2px 8px rgba(39,174,96,0.06);
  margin-bottom: 0;
`;
const StyledLabel = styled(Form.Label)`
  font-weight: 700;
  color: #27ae60;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const StyledTextarea = styled(Form.Control)`
  min-height: 80px;
  resize: vertical;
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 32px;
  justify-content: flex-end;
`;
const StyledButtonHTML = styled.button<{ variant?: string }>`
  font-size: 1.15rem;
  font-weight: 700;
  border-radius: 10px;
  padding: 12px 36px;
  box-shadow: 0 2px 8px rgba(39,174,96,0.10);
  border: none;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  ${(props) =>
    props.variant === 'success'
      ? `background: #27ae60; color: #fff;`
      : `background: #fff; color: #27ae60; border: 2px solid #27ae60;`}
  &:hover {
    filter: brightness(0.95);
    color: #fff;
    background: #219150;
    border-color: #219150;
  }
`;
const VolumeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 18px;
  margin-bottom: 8px;
`;
function renderVolumeFields(type: any, cat: any, materials: any, handleMaterialChange: any) {
  const firstRow = ['1L', '5L', '10L', '20L'];
  const secondRow = ['ML', 'GR', 'KG'];
  const fieldsFirst = firstRow.map(vol => (
    type.volumes.includes(vol) ? (
      <Field key={vol}>
        <Form.Label style={{ fontWeight: 700, textAlign: 'center', width: '100%' }}>{vol}</Form.Label>
        <Form.Control
          type="number"
          min={0}
          placeholder="0"
          value={materials[`${cat.category}|${type.name}|${vol}`] || ''}
          onChange={e => handleMaterialChange(cat.category, type.name, vol, e.target.value)}
        />
      </Field>
    ) : <Field key={vol} />
  ));
  const fieldsSecond = secondRow.map(vol => (
    type.volumes.includes(vol) ? (
      <Field key={vol}>
        <Form.Label style={{ fontWeight: 700, textAlign: 'center', width: '100%' }}>{vol}</Form.Label>
        <Form.Control
          type="number"
          min={0}
          placeholder="0"
          value={materials[`${cat.category}|${type.name}|${vol}`] || ''}
          onChange={e => handleMaterialChange(cat.category, type.name, vol, e.target.value)}
        />
      </Field>
    ) : <Field key={vol} />
  ));
  while (fieldsSecond.length < 4) fieldsSecond.push(<Field key={`empty2-${fieldsSecond.length}`} />);
  return (
    <>
      <VolumeGrid>{fieldsFirst}</VolumeGrid>
      <VolumeGrid>{fieldsSecond}</VolumeGrid>
    </>
  );
}
const EditDelivery: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<DeliveryFormData>({
    companyName: '',
    documentNumber: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    scheduledDate: '',
    notes: '',
  });
  const [materials, setMaterials] = useState<any>({});
  const [openTypes, setOpenTypes] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchDelivery() {
      try {
        const res = await api.get(`/api/deliveries/${id}`);
        const data = res.data;
        setFormData({
          companyName: data.companyName || '',
          documentNumber: data.documentNumber || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          phone: data.phone || '',
          scheduledDate: data.scheduledDate ? data.scheduledDate.slice(0, 10) : '',
          notes: data.notes || '',
        });
        setMaterials(data.materials ? JSON.parse(data.materials) : {});
      } catch (err) {
        toast.error('Erro ao carregar entrega.');
        navigate('/deliveries');
      } finally {
        setLoading(false);
      }
    }
    fetchDelivery();
  }, [id, navigate]);
  const toggleType = (cat: string, type: string) => {
    setOpenTypes(prev => ({ ...prev, [`${cat}|${type}`]: !prev[`${cat}|${type}`] }));
  };
  const handleMaterialChange = (cat: string, type: string, vol: string, value: string) => {
    setMaterials((prev: any) => ({ ...prev, [`${cat}|${type}|${vol}`]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/api/deliveries/${id}`, {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        materials: JSON.stringify(materials || {}),
      });
      toast.success('Entrega atualizada com sucesso!');
      navigate('/deliveries');
    } catch (error) {
      toast.error('Erro ao atualizar entrega.');
    }
  };
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
  return (
    <div className="with-navbar-padding" style={{ minHeight: '100vh', background: '#f8fbf8', paddingTop: 32 }}>
      <FormWrapper>
        <Title>Editar Entrega</Title>
        <StyledForm onSubmit={handleSubmit}>
          <MainFieldsWrapper>
            <MainField>
              <StyledLabel><FaIndustry /> Empresa <span className="text-danger">*</span></StyledLabel>
              <Form.Control value={formData.companyName} onChange={e => setFormData(f => ({ ...f, companyName: e.target.value }))} required placeholder="Nome da empresa" />
            </MainField>
            <MainField>
              <StyledLabel><FaIdCard /> CPF/CNPJ <span className="text-danger">*</span></StyledLabel>
              <Form.Control value={formData.documentNumber} onChange={e => setFormData(f => ({ ...f, documentNumber: e.target.value }))} required placeholder="CPF ou CNPJ" />
            </MainField>
            <MainField>
              <StyledLabel><FaMapMarkerAlt /> Endereço <span className="text-danger">*</span></StyledLabel>
              <Form.Control value={formData.address} onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} required placeholder="Endereço completo" />
            </MainField>
            <MainField>
              <StyledLabel><FaFlag /> Estado <span className="text-danger">*</span></StyledLabel>
              <Form.Control value={formData.state} onChange={e => setFormData(f => ({ ...f, state: e.target.value }))} required placeholder="Estado" />
            </MainField>
            <MainField>
              <StyledLabel><FaCity /> Cidade <span className="text-danger">*</span></StyledLabel>
              <Form.Control value={formData.city} onChange={e => setFormData(f => ({ ...f, city: e.target.value }))} required placeholder="Cidade" />
            </MainField>
            <MainField>
              <StyledLabel><FaCalendarAlt /> Data Agendada <span className="text-danger">*</span></StyledLabel>
              <Form.Control type="date" value={formData.scheduledDate} onChange={e => setFormData(f => ({ ...f, scheduledDate: e.target.value }))} required />
            </MainField>
            <MainField>
              <StyledLabel><FaPhone /> Telefone <span className="text-danger">*</span></StyledLabel>
              <Form.Control value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} required placeholder="Telefone para contato" />
            </MainField>
            <MainField style={{ gridColumn: '1 / 3' }}>
              <StyledLabel><FaClipboardList /> Observações</StyledLabel>
              <StyledTextarea as="textarea" rows={3} value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} placeholder="Observações adicionais" />
            </MainField>
          </MainFieldsWrapper>
          {MATERIAL_STRUCTURE.map(cat => (
            <SectionCard key={cat.category}>
              <SectionTitle>{cat.icon} {cat.category}</SectionTitle>
              {cat.types.map(type => {
                const isOpen = openTypes[`${cat.category}|${type.name}`];
                return (
                  <div key={type.name} style={{ marginBottom: 12 }}>
                    <TypeHeader onClick={() => toggleType(cat.category, type.name)}>
                      {type.icon} {type.name}
                      {isOpen ? <FaMinus style={{ marginLeft: 4, color: '#27ae60' }} /> : <FaPlus style={{ marginLeft: 4, color: '#27ae60' }} />}
                    </TypeHeader>
                    {isOpen && renderVolumeFields(type, cat, materials, handleMaterialChange)}
                  </div>
                );
              })}
            </SectionCard>
          ))}
          <ButtonRow>
            <StyledButtonHTML variant="success" type="submit">
              Salvar Alterações
            </StyledButtonHTML>
            <StyledButtonHTML variant="outline-secondary" onClick={() => navigate('/deliveries')} type="button">Cancelar</StyledButtonHTML>
          </ButtonRow>
        </StyledForm>
      </FormWrapper>
    </div>
  );
};
export default EditDelivery; 
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaIndustry, FaIdCard, FaMapMarkerAlt, FaCity, FaFlag, FaPhone, FaCalendarAlt, FaBox, FaFlask, FaRecycle, FaCubes, FaQuestionCircle, FaWeight, FaCube, FaBoxes, FaClipboardList, FaCheckCircle, FaTimesCircle, FaPlus, FaMinus } from 'react-icons/fa';
import DeliveryDistanceMap from '../components/DeliveryDistanceMap';
import axios from 'axios';
import MaskedInput from '../components/MaskedInput';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

interface DeliveryFormData {
  companyName: string;
  documentNumber: string;
  cep: string;
  address: string;
  number: string;
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
          value={materials[`${cat.category}|${type.name}|${vol}`]}
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
          value={materials[`${cat.category}|${type.name}|${vol}`]}
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

const CreateDelivery: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DeliveryFormData>({
    companyName: '',
    documentNumber: '',
    cep: '',
    address: '',
    number: '',
    city: '',
    state: '',
    phone: '',
    scheduledDate: '',
    notes: '',
  });
  const [price, setPrice] = useState<number | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [distanceError, setDistanceError] = useState('');

  const [materials, setMaterials] = useState(() => {
    const initial: any = {};
    MATERIAL_STRUCTURE.forEach(cat => {
      cat.types.forEach(type => {
        type.volumes.forEach(vol => {
          initial[`${cat.category}|${type.name}|${vol}`] = '';
        });
      });
    });
    return initial;
  });

  const [openTypes, setOpenTypes] = useState<{ [key: string]: boolean }>({});
  const toggleType = (cat: string, type: string) => {
    setOpenTypes(prev => ({ ...prev, [`${cat}|${type}`]: !prev[`${cat}|${type}`] }));
  };

  const handleMaterialChange = (cat: string, type: string, vol: string, value: string) => {
    setMaterials((prev: any) => ({ ...prev, [`${cat}|${type}|${vol}`]: value }));
  };

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    setCepLoading(true);
    setCepError('');
    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (res.data.erro) {
        setCepError('CEP não encontrado');
        return;
      }
      setFormData(f => ({
        ...f,
        address: res.data.logradouro || '',
        city: res.data.localidade || '',
        state: res.data.uf || '',
      }));
    } catch {
      setCepError('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const fullAddress = `${formData.address}, ${formData.number} - ${formData.city} - ${formData.state}, ${formData.cep}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/deliveries', {
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        materials: JSON.stringify(materials || {}),
        price: price,
      });
      toast.success('Entrega criada com sucesso!');
      navigate('/deliveries');
    } catch (error) {
      toast.error('Erro ao criar entrega.');
    }
  };

  const {
    ready,
    value: addressValue,
    suggestions: { status: suggestionsStatus, data: suggestionsData },
    setValue: setAddressValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "br" },
    },
    debounce: 300,
    defaultValue: formData.address,
  });

  React.useEffect(() => {
    setAddressValue(formData.address, false);
  }, [formData.address, setAddressValue]);

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressValue(e.target.value);
    setFormData(f => ({ ...f, address: e.target.value }));
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setAddressValue(suggestion.description, false);
    setFormData(f => ({ ...f, address: suggestion.description }));
    clearSuggestions();
  };

  return (
    <Container className="with-navbar-padding">
      <FormWrapper>
        <Title>Nova Entrega</Title>
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
              <StyledLabel>CEP <span className="text-danger">*</span></StyledLabel>
              <MaskedInput
                type="cep"
                value={formData.cep}
                onChange={cep => setFormData(f => ({ ...f, cep }))}
                onBlur={handleCepBlur}
                required
                placeholder="00000-000"
                className="form-control"
              />
              {cepLoading && <div style={{ color: '#27ae60', fontSize: 13 }}>Buscando endereço...</div>}
              {cepError && <div style={{ color: 'red', fontSize: 13 }}>{cepError}</div>}
            </MainField>
            <MainField>
              <StyledLabel>Número <span className="text-danger">*</span></StyledLabel>
              <Form.Control
                value={formData.number}
                onChange={e => setFormData(f => ({ ...f, number: e.target.value }))}
                required
                placeholder="Número"
              />
            </MainField>
            <MainField>
              <StyledLabel><FaMapMarkerAlt /> Endereço <span className="text-danger">*</span></StyledLabel>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  value={addressValue}
                  onChange={handleAddressInput}
                  required
                  placeholder="Endereço completo"
                  autoComplete="off"
                  disabled={!ready}
                />
                {suggestionsStatus === "OK" && suggestionsData.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    maxHeight: 180,
                    overflowY: 'auto',
                  }}>
                    {suggestionsData.map((suggestion: any) => (
                      <div
                        key={suggestion.place_id}
                        style={{ padding: 10, cursor: 'pointer', fontSize: 15 }}
                        onClick={() => handleSelectSuggestion(suggestion)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </MainField>
            <MainField>
              <StyledLabel><FaCity /> Cidade <span className="text-danger">*</span></StyledLabel>
              <Form.Control value={formData.city} onChange={e => setFormData(f => ({ ...f, city: e.target.value }))} required placeholder="Cidade" />
            </MainField>
            <MainField>
              <StyledLabel><FaFlag /> Estado <span className="text-danger">*</span></StyledLabel>
              <Form.Control value={formData.state} onChange={e => setFormData(f => ({ ...f, state: e.target.value }))} required placeholder="Estado" />
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

          <div style={{ marginTop: 8, marginBottom: 16 }}>
            {(formData.address && formData.number && formData.city && formData.state && formData.cep) ? (
              <>
                <DeliveryDistanceMap destination={fullAddress} onPriceChange={setPrice} onError={setDistanceError} />
                {price !== null && !distanceError && (
                  <div style={{ marginTop: 8, fontWeight: 700, color: '#27ae60', fontSize: 18 }}>
                    Valor da entrega: R$ {price.toFixed(2)}
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: '#888', fontSize: 15, marginTop: 8 }}>
                Preencha todos os campos do endereço para calcular o valor da entrega.
              </div>
            )}
          </div>

          <ButtonRow>
            <StyledButtonHTML variant="success" type="submit">
              Criar Entrega
            </StyledButtonHTML>
            <StyledButtonHTML variant="outline-secondary" onClick={() => navigate('/deliveries')} type="button">Cancelar</StyledButtonHTML>
          </ButtonRow>
          {distanceError && (
            <div style={{ color: 'red', marginTop: 16, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>
              {distanceError}
            </div>
          )}
        </StyledForm>
      </FormWrapper>
    </Container>
  );
};

export default CreateDelivery; 
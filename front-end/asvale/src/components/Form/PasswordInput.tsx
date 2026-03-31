import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Container, Label, Input as StyledInput, Error } from './styles';
import styled from 'styled-components';

const PasswordBox = styled.div`
  position: relative;
  width: 100%;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #222;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 100%;
`;

const PasswordInputStyled = styled(StyledInput)`
  padding-right: 2.5rem;
  width: 100%;
  box-sizing: border-box;
`;

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  isInvalid?: boolean;
  feedback?: string;
  showStrengthMeter?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  label,
  required = false,
  isInvalid = false,
  feedback,
  showStrengthMeter = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (showStrengthMeter) {
      let s = 0;
      if (value.length > 5) s++;
      if (/[A-Z]/.test(value)) s++;
      if (/[0-9]/.test(value)) s++;
      if (/[^A-Za-z0-9]/.test(value)) s++;
      setStrength(s);
    }
  }, [value, showStrengthMeter]);

  return (
    <Container>
      {label && (
        <Label>
          {label}
          {required && <span className="text-danger">*</span>}
        </Label>
      )}
      <PasswordBox>
        <PasswordInputStyled
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={value}
          onChange={onChange}
          autoComplete="current-password"
        />
        <EyeIcon onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </EyeIcon>
      </PasswordBox>
      {showStrengthMeter && (
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <div style={{ height: 6, background: '#eee', borderRadius: 4 }}>
            <div style={{
              width: `${(strength / 4) * 100}%`,
              height: 6,
              background: strength < 2 ? '#e74c3c' : strength < 3 ? '#f1c40f' : '#27ae60',
              borderRadius: 4,
              transition: 'width 0.3s',
            }} />
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
            {strength === 0 ? 'Muito fraca' : strength === 1 ? 'Fraca' : strength === 2 ? 'Média' : strength === 3 ? 'Forte' : 'Muito forte'}
          </div>
        </div>
      )}
      {isInvalid && feedback && <Error>{feedback}</Error>}
    </Container>
  );
};

export default PasswordInput; 
import React from 'react';
import InputMask from 'react-input-mask';
import { Input } from '../Form/styles';

type MaskType = 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date';

interface MaskedInputProps {
  type: MaskType;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  feedback?: string;
}

const getMask = (type: MaskType): string => {
  switch (type) {
    case 'cpf':
      return '999.999.999-99';
    case 'cnpj':
      return '99.999.999/9999-99';
    case 'phone':
      return '(99) 99999-9999';
    case 'cep':
      return '99999-999';
    case 'date':
      return '99/99/9999';
    default:
      return '';
  }
};

const formatValue = (value: string): string => {
  return value.replace(/\D/g, '');
};

const validateValue = (type: MaskType, value: string): boolean => {
  const numericValue = formatValue(value);

  switch (type) {
    case 'cpf':
      return validateCPF(numericValue);
    case 'cnpj':
      return validateCNPJ(numericValue);
    case 'phone':
      return numericValue.length >= 10 && numericValue.length <= 11;
    case 'cep':
      return numericValue.length === 8;
    case 'date':
      return validateDate(value);
    default:
      return true;
  }
};

const validateCPF = (cpf: string): boolean => {
  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

const validateCNPJ = (cnpj: string): boolean => {
  if (cnpj.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};

const validateDate = (date: string): boolean => {
  const [day, month, year] = date.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  return (
    dateObj.getDate() === day &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getFullYear() === year &&
    year >= 1900 &&
    year <= new Date().getFullYear()
  );
};

const MaskedInput: React.FC<MaskedInputProps> = ({
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  required = false,
  disabled = false,
  isInvalid = false,
  feedback,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div style={{ width: '100%' }}>
      <Input
        as={InputMask}
        style={{ width: '100%', boxSizing: 'border-box' }}
        mask={getMask(type)}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={className + (isInvalid ? ' is-invalid' : '')}
        required={required}
        disabled={disabled}
        maskChar={null}
      />
      {isInvalid && feedback && (
        <div style={{ color: '#d64545', fontSize: 13, marginTop: 4 }}>{feedback}</div>
      )}
    </div>
  );
};

export default MaskedInput; 
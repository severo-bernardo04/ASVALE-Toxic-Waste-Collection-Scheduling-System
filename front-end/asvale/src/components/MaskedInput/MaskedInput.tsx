import React from 'react';
import InputMask from 'react-input-mask';
import { Form } from 'react-bootstrap';
import { Input } from '../Form/styles';

interface MaskedInputProps {
  mask?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  label?: string;
  required?: boolean;
  className?: string;
  isInvalid?: boolean;
  feedback?: string;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  mask,
  value,
  onChange,
  placeholder,
  type = 'text',
  label,
  required = false,
  className = '',
  isInvalid = false,
  feedback
}) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}{required && <span className="text-danger">*</span>}</Form.Label>}
      {mask ? (
        <InputMask
          mask={mask}
          value={value}
          onChange={onChange}
          className={className}
          placeholder={placeholder}
          type={type}
        >
          {(inputProps: any) => (
            <Input
              {...inputProps}
              className={`${className} ${isInvalid ? 'is-invalid' : ''}`}
            />
          )}
        </InputMask>
      ) : (
        <Input
          value={value}
          onChange={onChange}
          className={`${className} ${isInvalid ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          type={type}
        />
      )}
      {isInvalid && feedback && (
        <Form.Control.Feedback type="invalid">
          {feedback}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default MaskedInput; 
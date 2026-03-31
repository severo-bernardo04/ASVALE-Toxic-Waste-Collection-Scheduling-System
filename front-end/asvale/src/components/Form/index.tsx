import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  Error,
  SubmitButton,
  Container,
} from './styles';

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
  return <FormContainer onSubmit={onSubmit}>{children}</FormContainer>;
};

interface BaseFormFieldProps {
  label: string;
  error?: string;
}

interface InputFormFieldProps extends BaseFormFieldProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
}

interface SelectFormFieldProps extends BaseFormFieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  as: 'select';
}

interface TextareaFormFieldProps extends BaseFormFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
}

type FormFieldProps = InputFormFieldProps | SelectFormFieldProps | TextareaFormFieldProps;

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  as = 'input',
  ...props
}) => {
  const renderInput = () => {
    switch (as) {
      case 'textarea':
        return <TextArea {...props as TextareaHTMLAttributes<HTMLTextAreaElement>} />;
      case 'select':
        return <Select {...props as SelectHTMLAttributes<HTMLSelectElement>}>{props.children}</Select>;
      default:
        return <Input {...props as InputHTMLAttributes<HTMLInputElement>} />;
    }
  };

  return (
    <Container>
      <Label htmlFor={props.name}>{label}</Label>
      {renderInput()}
      {error && <Error>{error}</Error>}
    </Container>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  ...props
}) => {
  return (
    <SubmitButton {...props} disabled={isLoading || props.disabled}>
      {isLoading ? 'Carregando...' : children}
    </SubmitButton>
  );
};

export default FormField; 
import { Form } from "react-bootstrap";
import { RegisterOptions, UseFormRegister, FieldError } from "react-hook-form";
interface option {
  value: string | number;
  key: string | number;
}
interface TextInputFieldProps {
  name: string;
  label?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  options?: option[];
  hasDefaultValue?: boolean;
  margin?: boolean;
  [x: string]: any;
}

const TextInputField = ({
  name,
  label,
  placeholder,
  register,
  registerOptions,
  error,
  hasDefaultValue,
  options,
  margin = true,
  ...props
}: TextInputFieldProps) => {
  return (
    <Form.Group
      className={margin ? "mb-3" : undefined}
      controlId={name + "-input"}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        {...register(name, registerOptions)}
        {...props}
        placeholder={placeholder}
        isInvalid={!!error}
      >
        {options ? (
          <>
            {hasDefaultValue && <option value={""}>{placeholder}</option>}
            {options.map((option) => (
              <option key={option.key} value={option.value}>
                {option.key}
              </option>
            ))}
          </>
        ) : null}
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;

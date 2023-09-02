import { Form } from "react-bootstrap";
import { RegisterOptions, UseFormRegister, FieldError } from "react-hook-form";


export interface Option {
  value: string | number;
  key: string | number;
}
interface CheckInputFieldProps {
  name: string;
  label?: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  options?: Option[];
  hasDefaultValue?: boolean;
  margin?: boolean;
  [x: string]: any;
}

const CheckInputField = ({
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
}: CheckInputFieldProps) => {
  return (
    <Form.Group
      className={margin ? "mb-3" : undefined}
      controlId={name + "-input"}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Check
        {...register(name, registerOptions)}
        {...props}
        placeholder={placeholder}
        isInvalid={!!error}
      >
        {options ? (
          <>
            {hasDefaultValue && (
              <option value={""} disabled selected>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.key} value={option.value}>
                {option.key}
              </option>
            ))}
          </>
        ) : null}
      </Form.Check>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default CheckInputField;

import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextInputField from "../components/form/TextInputField";
import * as AuthApi from "../network/authApi";
import { SendRecoverPasswordEmailForm } from "../network/authApi";

const SendRecoverPasswordEmailPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SendRecoverPasswordEmailForm>();

  const onSubmit = async (data: SendRecoverPasswordEmailForm) => {
    try {
      await AuthApi.sendRecoverPasswordEmail(data);
      toast.success("Email enviado com sucesso!");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextInputField
        name="email"
        label=""
        type="text"
        placeholder="Email"
        register={register}
        registerOptions={{
          required: "Campo Obrigatório",
        }}
        error={errors.email}
      />
      <Button type="submit" disabled={isSubmitting}>
        ENVIAR
      </Button>
      <button onClick={() => navigate(-1)}>VOLTAR</button>
    </Form>
  );
};

export default SendRecoverPasswordEmailPage;

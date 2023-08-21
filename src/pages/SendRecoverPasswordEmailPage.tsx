import { Button, Col, Form, Row } from "react-bootstrap";
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
      <Row xs={2} className="g-4">
        <Col>
      <Button type="submit" disabled={isSubmitting}>
        ENVIAR
      </Button>
        </Col>
        <Col>
      <Button onClick={() => navigate(-1)} >
      VOLTAR
      </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SendRecoverPasswordEmailPage;

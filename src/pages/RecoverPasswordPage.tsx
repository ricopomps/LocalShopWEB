import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import TextInputField from "../components/form/TextInputField";
import * as AuthApi from "../network/authApi";
import { RecoverPasswordForm } from "../network/authApi";

const RecoverPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RecoverPasswordForm>();

  const onSubmit = async (data: RecoverPasswordForm) => {
    try {
      const queryParameters = new URLSearchParams(location.search);
      const token = queryParameters.get("token");
      if (!token) throw Error("Token inválido");
      await AuthApi.changePassword({ ...data, token });
      toast.success("Senha trocada com sucesso");
      navigate("/logindesktop");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  const passwordMinLength = 7;
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextInputField
        name="newPassword"
        label=""
        type="password"
        placeholder="Nova senha"
        register={register}
        registerOptions={{
          required: "Campo Obrigatório",
          validate: {
            minLength: (n) =>
              n.length > passwordMinLength || "Senha muito curta",
          },
        }}
        error={errors.newPassword}
      />
      <TextInputField
        name="newPasswordConfirmation"
        label=""
        type="password"
        placeholder="Confirme a senha"
        register={register}
        registerOptions={{
          required: "Campo Obrigatório",
          validate: {
            minLength: (n) =>
              n.length > passwordMinLength || "Senha muito curta",
            value: (n) => n === getValues("newPassword") || "Senhas diferentes",
          },
        }}
        error={errors.newPasswordConfirmation}
      />
      <Button type="submit" disabled={isSubmitting}>
        Salvar
      </Button>
    </Form>
  );
};

export default RecoverPasswordPage;

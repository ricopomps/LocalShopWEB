import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import styles from "../styles/SignUpPage.module.css";
import { useForm } from "react-hook-form";
import { SignUpCredentials } from "../network/notes_api";
import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import * as NotesApi from "../network/notes_api";
import { User, UserType } from "../models/user";
import { toast } from "react-toastify";
import { googleAuth } from "../network/authApi";

interface SignUpPageProps {
  onSignUpSuccessful: (user: User) => void;
  userType: UserType;
}

const SignUpPage = ({ onSignUpSuccessful, userType }: SignUpPageProps) => {
  const placeholderLogin = "Login";
  const placeholderEmail = "E-mail";
  const placeholderSenha = "Senha";
  const placeholderCPF = "CPF";
  const placeholderSenhaConfirma = "Confirmação de senha";

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  const googleAuthCall = async () => {
    try {
      const { url } = await googleAuth(userType);
      console.log(url);
      window.location.href = url;
    } catch (error: any) {
      console.log(error);

      toast.error(error.message);
    }
  };

  const onSubmit = async (data: SignUpCredentials) => {
    try {
      data.userType = userType;
      const user = await NotesApi.signUp(data);
      toast.success("Cadastro realizado com sucesso!");
      onSignUpSuccessful(user);
      navigate(userType === UserType.shopper ? "/shopper" : "/store");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };
  return (
    <div className={styles.main}>
      <img src={logo} alt="logo" className="imageLogin" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name="username"
          type="text"
          placeholder={placeholderLogin}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.username}
        />
        <TextInputField
          name="email"
          type="text"
          placeholder={placeholderEmail}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.email}
        />
        <TextInputField
          name="cpf"
          type="text"
          placeholder={placeholderCPF}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.cpf}
        />
        <TextInputField
          name="password"
          type="password"
          placeholder={placeholderSenha}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.password}
        />
        <TextInputField
          name="confirmedPassword"
          type="password"
          placeholder={placeholderSenhaConfirma}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.confirmedPassword}
        />
        <Button className={styles.btn} onClick={googleAuthCall}>
          CADASTRAR com o google
        </Button>
        <Button className={styles.btn} type="submit" disabled={isSubmitting}>
          CADASTRAR
        </Button>
      </Form>
      <button onClick={() => navigate(-1)} className={styles.btn}>
        VOLTAR
      </button>
    </div>
  );
};
export default SignUpPage;

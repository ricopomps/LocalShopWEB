import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import styles from "../styles/CadastroShopper.module.css";
import { useForm } from "react-hook-form";
import { SignUpCredentials } from "../network/notes_api";
import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import * as NotesApi from "../network/notes_api";
import { User, UserType } from "../models/user";

interface SignUpPageProps {
  onSignUpSuccessful: (user: User) => void;
  userType: UserType;
}

const SignUpPage = ({ onSignUpSuccessful, userType }: SignUpPageProps) => {
  const placeholderLogin = "Insira seu login...";
  const placeholderEmail = "Insira seu email...";
  const placeholderSenha = "Insira sua senha...";
  const placeholderCPF = "Insira seu CPF...";
  const placeholderSenhaConfirma = "Insira sua senha outra vez...";

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  const onSubmit = async (data: SignUpCredentials) => {
    try {
      data.userType = userType;
      const user = await NotesApi.signUp(data);
      onSignUpSuccessful(user);
      navigate(userType === UserType.shopper ? "/shopper" : "/store");
    } catch (error) {
      console.log("error", error);
      alert(error);
    }
  };
  return (
    <div className="main">
      <img src={logo} alt="logo" className="imageLogin" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          className={styles.inputLogin}
          name="username"
          type="text"
          placeholder={placeholderLogin}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.username}
        />
        <TextInputField
          className={styles.inputLogin}
          name="email"
          type="text"
          placeholder={placeholderEmail}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.email}
        />
        <TextInputField
          className={styles.inputLogin}
          name="cpf"
          type="text"
          placeholder={placeholderCPF}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.cpf}
        />
        <TextInputField
          className={styles.inputLogin}
          name="password"
          type="password"
          placeholder={placeholderSenha}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.password}
        />
        <TextInputField
          className={styles.inputLogin}
          name="confirmedPassword"
          type="password"
          placeholder={placeholderSenhaConfirma}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.confirmedPassword}
        />
        <Button type="submit" disabled={isSubmitting}>
          CADASTRAR
        </Button>
      </Form>
      <button onClick={() => navigate(-1)} className="btn btn_login ">
        VOLTAR
      </button>
    </div>
  );
};
export default SignUpPage;

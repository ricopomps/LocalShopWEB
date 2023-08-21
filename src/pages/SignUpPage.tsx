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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  const onSubmit = async (data: SignUpCredentials) => {
    console.log(data);
    try {
      data.userType = userType;
      const user = await NotesApi.signUp(data);
      onSignUpSuccessful(user);
      navigate(userType === UserType.shopper ? "/shopper" : "/store");
      console.log("user", user);
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
          name="username"
          type="text"
          placeholder="Usuário"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.username}
        />
        <TextInputField
          name="email"
          type="text"
          placeholder="E-mail"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.email}
        />
        <TextInputField
          name="cpf"
          type="text"
          placeholder="CPF"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.cpf}
        />
        <TextInputField
          name="password"
          type="password"
          placeholder="Senha"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.password}
        />
        <TextInputField
          name="confirmedPassword"
          type="password"
          placeholder="Confirmar Senha"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.confirmedPassword}
        />
        <Button type="submit" disabled={isSubmitting}>
          Cadastrar
        </Button>
      </Form>
      <button onClick={() => navigate(-1)} className="btn btn_login ">
        VOLTAR
      </button>
    </div>
  );
};
export default SignUpPage;

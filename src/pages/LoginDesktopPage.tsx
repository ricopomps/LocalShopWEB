import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useForm } from "react-hook-form";
import { LoginCredentials } from "../network/notes_api";
import { Form, Button } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import * as NotesApi from "../network/notes_api";
import * as StoresApi from "../network/storeApi";
import { User, UserType } from "../models/user";
import styles from "../styles/LoginDesktop.module.css";

interface LoginDesktopPageProps {
  onLoginSuccessful: (user: User) => void;
}
const LoginDesktopPage = ({ onLoginSuccessful }: LoginDesktopPageProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();
  const onSubmit = async (data: LoginCredentials) => {
    try {
      const user = await NotesApi.login(data);
      const store = await StoresApi.getStoreByLoggedUser();

      onLoginSuccessful({ ...user, store });
      if (user.userType === UserType.shopper) {
        navigate("/shopper");
      } else {
        navigate(store ? "/products" : "/store");
      }
      console.log("user", user);
    } catch (error) {
      console.log("error", error);
      alert(error);
    }
    console.log(data);
  };
  return (
    <div className={styles.main}>
      <img src={logo} alt="logo" className={styles.imageLogin} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          className={styles.inputLogin}
          name="username"
          label=""
          type="text"
          placeholder="Usuário"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.username}
        />
        <TextInputField
          className={styles.inputSenha}
          name="password"
          label=""
          type="password"
          placeholder="Senha"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.password}
        />
        <Link to="/forgotpassword" className={styles.cadastreLink}>
          Esqueceu a senha?
        </Link>
        <Button className={styles.btn} type="submit" disabled={isSubmitting}>
          LOGIN
        </Button>
      </Form>
      <button onClick={() => navigate(-1)} className={styles.btn}>
        VOLTAR
      </button>
    </div>
  );
};

export default LoginDesktopPage;

import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import { LoginCredentials } from "../network/notes_api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.css";
import logo from "../assets/logo.svg";


interface ProfileForm{
    name:string;
    email:string;
    password:string;
}
const ProfilePage = () => {

const navigate = useNavigate();
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<ProfileForm>();
 const onSubmit = (data : ProfileForm) =>{
    console.log(data);
 }
  return (
    <div id={styles.principal}>
      <img src={logo} alt="logo" className={styles.imageLogin} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          className={styles.input}
          name="name"
          label="Nome:"
          type="text"
          placeholder=""
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.name}
        />
        <TextInputField
          className={styles.input}
          name="email"
          label="Email:"
          type="text"
          placeholder=""
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.email}
        />
        <TextInputField
          className={styles.input}
          name="password"
          label="Senha:"
          type="password"
          placeholder=""
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.password}
        />
        <Button className={styles.btn} type="submit" disabled={isSubmitting}>
          Login
        </Button>
      </Form>
      <Button className={styles.btn} onClick={() => navigate(-1)}>
        Voltar
      </Button>
    </div>
  );
};

export default ProfilePage;

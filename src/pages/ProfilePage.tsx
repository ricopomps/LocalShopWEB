import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import { LoginCredentials } from "../network/notes_api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.css";


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
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          //className={styles.inputLogin}
          name="name"
          label=""
          type="text"
          placeholder="Name"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.name}
        />
        <TextInputField
          //className={styles.inputSenha}
          name="email"
          label=""
          type="text"
          placeholder="Email"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.email}
        />
        <TextInputField
          //className={styles.inputSenha}
          name="password"
          label=""
          type="password"
          placeholder="Senha"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.password}
        />
        <Button
          /*className={styles.btn} */ type="submit"
          disabled={isSubmitting}
        >
          LOGIN
        </Button>
      </Form>
      <Button /*className={styles.btn} */ onClick={() => navigate(-1)}>
        Voltar
      </Button>
    </div>
  );
};

export default ProfilePage;

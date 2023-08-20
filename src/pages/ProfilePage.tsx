import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import { LoginCredentials } from "../network/notes_api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.css";
import logo from "../assets/logo.svg";
import { User } from "../models/user";
import * as UserApi from "../network/notes_api";
interface ProfilePageProps{
  user: User;
}

export interface ProfileForm{
    name:string;
    email:string;
}
const ProfilePage = ({user}:ProfilePageProps) => {

const navigate = useNavigate();
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<ProfileForm>({
  defaultValues: {
    name: user?.username || "",
    email: user?.email || ""
  },
});


 const onSubmit = async( data : ProfileForm) =>{
   try {
    const response = await UserApi.updateUser(data);
    console.log(response);
   } catch (error) {
    alert(error);
   }
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
        <Button className={styles.btn} type="submit" disabled={isSubmitting}>
          Alterar
        </Button>
      </Form>
      <Button className={styles.btn} onClick={() => navigate(-1)}>
        Voltar
      </Button>
    </div>
  );
};

export default ProfilePage;

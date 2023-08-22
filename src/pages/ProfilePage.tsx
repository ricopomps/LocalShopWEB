import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.css";
import logo from "../assets/logo.svg";
import { User } from "../models/user";
import * as UserApi from "../network/notes_api";
import { toast } from "react-toastify";
interface ProfilePageProps {
  user: User;
}

export interface ProfileForm {
  username: string;
  email: string;
  cpf: string;
}
const ProfilePage = ({ user }: ProfilePageProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      cpf: user?.cpf || "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      const response = await UserApi.updateUser(data);
      toast.success("Atualização realizada com sucesso!");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };
  return (
    <div id={styles.principal}>
      <img src={logo} alt="logo" className={styles.imageLogin} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          className={styles.input}
          name="username"
          label="Nome:"
          type="text"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.username}
        />
        <TextInputField
          className={styles.input}
          name="email"
          label="Email:"
          type="text"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.email}
        />
        <TextInputField
          className={styles.input}
          name="cpf"
          label="cpf:"
          type="text"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.cpf}
          disabled
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

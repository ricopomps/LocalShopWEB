import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import styles from "../styles/CadastroShopper.module.css";

const CadastroLojistaPage = () => {
  const placeholderLogin = "Insira seu login...";
  const placeholderEmail = "Insira seu email...";
  const placeholderSenha = "Insira sua senha...";
  const placeholderCNPJ = "Insira seu CNPJ...";
  const navigate = useNavigate();
  return (
    <div className="main">
      <img src={logo} alt="logo" className={styles.imageLogin} />
      <input
        type="text"
        placeholder={placeholderLogin}
        className={styles.inputLogin}
      />
      <input
        type="text"
        placeholder={placeholderEmail}
        className={styles.inputLogin}
      />
      <input
        type="text"
        placeholder={placeholderCNPJ}
        className={styles.inputLogin}
      />
      <input
        type="password"
        placeholder={placeholderSenha}
        className={styles.inputLogin}
      />
      <button className={styles.btn}>CADASTRAR</button>
      <button onClick={() => navigate(-1)} className={styles.btn}>
        VOLTAR
      </button>
    </div>
  );
};

export default CadastroLojistaPage;

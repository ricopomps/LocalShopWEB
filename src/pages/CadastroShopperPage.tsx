import { useNavigate } from "react-router-dom";
import styles from "../styles/CadastroShopper.module.css";
import logo from "../assets/logo.svg";

const placeholderLogin = "Insira seu login...";
const placeholderEmail = "Insira seu email...";
const placeholderSenha = "Insira sua senha...";
const placeholderCPF = "Insira seu CPF...";
function CadastroShopperPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.main}>
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
        placeholder={placeholderCPF}
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
}
export default CadastroShopperPage;
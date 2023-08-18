import { useNavigate } from "react-router-dom";
import styles from "../styles/CadastroShopper.module.css";

const CadastroShopperPage = () => {
  const placeholderLogin = "Insira seu login...";
  const placeholderEmail = "Insira seu email...";
  const placeholderSenha = "Insira sua senha...";
  const placeholderCPF = "Insira seu CPF...";
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      {/* <img src={logo} alt='logo' className='imageLogin'/> */}
      <input
        type="text"
        placeholder={placeholderLogin}
        className="inputLogin"
      />
      <input
        type="text"
        placeholder={placeholderEmail}
        className="inputLogin"
      />
      <input type="text" placeholder={placeholderCPF} className="inputLogin" />
      <input
        type="password"
        placeholder={placeholderSenha}
        className="inputSenha"
      />
      <button className="btn btn_cadastro">CADASTRAR</button>
      <button onClick={() => navigate(-1)} className="btn btn_login">
        VOLTAR
      </button>
    </div>
  );
};

export default CadastroShopperPage;
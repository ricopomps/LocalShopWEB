import "./index.css";
import "./reset.css";
import logo from "./assets/logo.svg";
import styles from "./styles.LoginDesktop.module.css";
const placeholderLogin = "Insira seu login...";
const placeholderEmail = "Insira seu email...";
const placeholderSenha = "Insira sua senha...";

function Login() {
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
        className="inputLogin"
      />
      <input
        type="password"
        placeholder={placeholderSenha}
        className="inputSenha"
      />
      <button className="btn btn_login ">LOGIN</button>
    </div>
  );
}

export default Login;

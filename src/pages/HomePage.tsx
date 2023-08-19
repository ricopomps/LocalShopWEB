import logo from "../assets/logo.svg";
import google from "../assets/google.svg";
import email from "../assets/email.svg";
import { Link, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import styles from "../styles/HomePage.module.css";

interface ButtonLoginProps {
  imagem?: string;
  children: ReactNode;
  path: string;
}

const HomePage = () => {
  const navigate = useNavigate();

  const ButtonLogin = ({ imagem, children, path }: ButtonLoginProps) => {
    return (
      <button onClick={() => navigate(path)} className="btn">
        {imagem && <img src={imagem} alt="button logo" />}
        {children}{" "}
      </button>
    );
  };
  return (
    <div className={styles.main}>
      <img src={logo} alt="logo" className="image" />
      <h1 className={styles.title}>LocalShop</h1>
      <h2 className={styles.subtitle}>Como desejar continuar?</h2>
      <ButtonLogin imagem={google} path="/logindesktop">
        Continue com Google
      </ButtonLogin>
      <ButtonLogin imagem={email} path="/logindesktop">
        Continue com E-Mail
      </ButtonLogin>
      <Link to="/cadshopper" className={styles.cadastreLink}>
        Não tem login? Cadastre-se
      </Link>
      <ButtonLogin path="/cadlojista">Deseja cadastrar sua loja?</ButtonLogin>
    </div>
  );
};

export default HomePage;

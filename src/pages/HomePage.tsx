import { ReactNode, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import google from "../assets/google.svg";
import email from "../assets/email.svg";
import * as StoresApi from "../network/storeApi";
import styles from "../styles/HomePage.module.css";
import { getGoogleAuthUser, googleAuth } from "../network/authApi";
import { User, UserType } from "../models/user";
import { useUser } from "../context/UserContext";

interface ButtonLoginProps {
  imagem?: string;
  children: ReactNode;
  path: string;
  onClick?: () => void;
}

interface HomePageProps {}

const HomePage = ({}: HomePageProps) => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const ButtonLogin = ({
    imagem,
    children,
    path,
    onClick,
  }: ButtonLoginProps) => {
    return (
      <button
        onClick={() => (onClick ? onClick() : navigate(path))}
        className="btn"
      >
        {imagem && <img src={imagem} alt="button logo" />}
        {children}{" "}
      </button>
    );
  };

  const googleAuthCall = async () => {
    try {
      const { url } = await googleAuth();
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const location = useLocation();
  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current === false) {
      const params = new URLSearchParams(location.search);
      const code = params.get("code");
      const userType = params.get("state");

      if (code) {
        fetchUserData(code, userType ?? undefined);
      }

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const fetchUserData = async (code: any, userType?: string) => {
    try {
      const response = await getGoogleAuthUser(code, userType);

      login(response.user, response.accessToken);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
      console.error("Error fetching user data:", error);
    }
  };

  const login = async (user: User, accessToken: string) => {
    const store = await StoresApi.getStoreByLoggedUser();
    setUser({ ...user, store });
    if (user.userType === UserType.shopper) {
      navigate("/shopper");
    } else {
      navigate(store ? "/products" : "/store");
    }
  };
  return (
    <div className={styles.main}>
      <img src={logo} alt="logo" className="image" />
      <h1 className={styles.title}>LocalShop</h1>
      <h2 className={styles.subtitle}>Como desejar continuar?</h2>
      <ButtonLogin
        imagem={google}
        onClick={() => googleAuthCall()}
        path="/logindesktop"
      >
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

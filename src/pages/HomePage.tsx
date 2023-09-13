import { ReactNode, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import google from "../assets/google.svg";
import email from "../assets/email.svg";
import styles from "../styles/HomePage.module.css";
import { getGoogleAuthUser, googleAuth } from "../network/authApi";
import { User, UserType } from "../models/user";
import { useUser } from "../context/UserContext";
import RoutesEnum from "../utils/routesEnum";

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
      const { user, accessToken } = await getGoogleAuthUser(code, userType);
      login(user, accessToken);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
      console.error("Error fetching user data:", error);
    }
  };

  const login = async (user: User, accessToken: string) => {
    setUser(user);
    if (user.userType === UserType.shopper) {
      navigate(RoutesEnum.SHOPPER);
    } else {
      navigate(user.store ? RoutesEnum.PRODUCTS : RoutesEnum.STORE);
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
        path={RoutesEnum.LOGIN}
      >
        Continue com Google
      </ButtonLogin>
      <ButtonLogin imagem={email} path={RoutesEnum.LOGIN}>
        Continue com E-Mail
      </ButtonLogin>
      <Link to={RoutesEnum.SIGN_UP_SHOPPER} className={styles.cadastreLink}>
        Não tem login? Cadastre-se
      </Link>
      <ButtonLogin path={RoutesEnum.SIGN_UP_STORE}>
        Deseja cadastrar sua loja?
      </ButtonLogin>
    </div>
  );
};

export default HomePage;

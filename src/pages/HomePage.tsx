import logo from "../assets/logo.svg";
import google from "../assets/google.svg";
import email from "../assets/email.svg";
import * as StoresApi from "../network/storeApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import styles from "../styles/HomePage.module.css";
import { toast } from "react-toastify";
import { getGoogleAuthUser, googleAuth } from "../network/authApi";
import { Button } from "react-bootstrap";
import { User, UserType } from "../models/user";

interface ButtonLoginProps {
  imagem?: string;
  children: ReactNode;
  path: string;
}

interface HomePageProps {
  onLoginSuccessful: (user: User) => void;
}

const HomePage = ({ onLoginSuccessful }: HomePageProps) => {
  const navigate = useNavigate();

  const ButtonLogin = ({ imagem, children, path }: ButtonLoginProps) => {
    return (
      <button onClick={() => navigate(path)} className="btn">
        {imagem && <img src={imagem} alt="button logo" />}
        {children}{" "}
      </button>
    );
  };

  const googleAuthCall = async () => {
    try {
      const { url } = await googleAuth();
      console.log(url);
      window.location.href = url;
    } catch (error: any) {
      console.log(error);

      toast.error(error.message);
    }
  };
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const userType = params.get("state");
    console.log("params", params);
    console.log(code, code);

    if (code) {
      // Call the function to fetch user information
      fetchUserData(code, userType ?? undefined);
    }
  }, []);

  const fetchUserData = async (code: any, userType?: string) => {
    try {
      const response = await getGoogleAuthUser(code, userType);
      console.log(response);
      //DO LOGIN
      // Now you have the user information (userData), you can use or store it as needed
      login(response.user, response.accessToken);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
      console.error("Error fetching user data:", error);
    }
  };

  const login = async (user: User, accessToken: string) => {
    sessionStorage.removeItem("token");
    sessionStorage.setItem("token", accessToken);
    const store = await StoresApi.getStoreByLoggedUser();
    onLoginSuccessful({ ...user, store });
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
      {/* <ButtonLogin imagem={google} path="/logindesktop">
        Continue com Google
      </ButtonLogin> */}
      <Button onClick={() => googleAuthCall()}>Continuar com o google</Button>
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

import "./index.css";
import "./reset.css";
import logo from "./assets/logo.svg";
import google from "./assets/google.svg";
import email from "./assets/email.svg";

function TelaInicial() {
  return (
    <div className="main">
      <img src={logo} alt="logo" className="image" />
      <h1 className="title">LocalShop</h1>
      <h2 className="subtitle">Como desejar continuar?</h2>
      <ButtonLogin imagem={google}>Continue com Google</ButtonLogin>
      <ButtonLogin imagem={email}>Continue com E-mail</ButtonLogin>
      <p className="subtitle" a href="null">
        Não tem login? Cadastre-se
      </p>
      <button className="btn">Deseja cadastrar sua loja?</button>
    </div>
  );

  function ButtonLogin({ imagem, children }) {
    return (
      <button className="btn">
        <img src={imagem} alt="button logo" />
        {children}{" "}
      </button>
    );
  }
}

export default TelaInicial;

//acho que o typescript não aceita essa função dessa forma, imagino que o certo seja fazer em componente (mas não sei fazer isso, então
//deixei como js mesmo pra depois ajeitarmos!)

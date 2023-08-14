const CadastroShopperPage = () => {
const placeholderLogin = 'Insira seu login...'
const placeholderEmail= 'Insira seu email...'
const placeholderSenha = 'Insira sua senha...'
const placeholderCPF = 'Insira sua cpf...'

  return (
    <div className="main">
        {/* <img src={logo} alt='logo' className='imageLogin'/> */}
        <input type='text' placeholder={placeholderLogin} className='inputLogin'/>
        <input type='text' placeholder={placeholderEmail} className='inputLogin'/>
        <input type='text' placeholder={placeholderCPF} className='inputLogin'/>
        <input type='password' placeholder={placeholderSenha} className='inputSenha'/>
        <button className='btn btn_cadastro'>CADASTRAR</button>
        <button className='btn btn_login'>VOLTAR</button>

     </div>
  );
};

export default CadastroShopperPage;

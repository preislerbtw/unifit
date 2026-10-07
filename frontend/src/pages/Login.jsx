import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logo.png";

const inicial = {
  matricula: "",
  senha: ""
};

function validar(v) {
  const erros = {};

  if (!v.matricula.trim()) {
    erros.matricula = "Informe sua matrícula.";
  }

  if (!v.senha) {
    erros.senha = "Informe sua senha.";
  }
  return erros;
}

function Login() {
  const [valores, setValores] = useState(inicial);
  const [erros, setErros] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: value }));
    setErros((er) => ({ ...er, [name]: undefined })); 
  }

  const [enviando, setEnviando] = useState(false);

  const [continuarConectado, setContinuarConectado] = useState(false);

  async function handleSubmit(e) { // function that navigate through login to "menu"
    e.preventDefault();

  const novosErros = validar(valores);

  if (Object.keys(novosErros).length > 0) {
    setErros(novosErros);
    return;
  }
setEnviando(true);  
try{
  const resposta = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(valores)
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
      setErros({ aviso: dados.message || "Não foi possível enviar." });
      return;
  }
    const storage = continuarConectado ? localStorage : sessionStorage;
    storage.setItem("logado", "true");
    storage.setItem("usuario_logado", JSON.stringify(dados.usuario));
    navigate("/home");
} catch (erro) {
    console.error(erro);
    setErros({ aviso: "Não foi possível conectar ao servidor." });
  }finally {
    setEnviando(false);
  }
}

  return (
    <div className="login-page">
      <div className="login-banner">
        <img src={logo} alt="UniFit" className="login-banner-logo" />
      </div>
      <div className="login-form-side">
        <div className="login-card">
          <img src="/icon-unifor.webp" alt="Unifor" className="login-icon" />
          <h1 className="login-title">Acesse sua conta UniFit</h1>
          <p className="login-subtitle">Entre para montar seus treinos</p>

          {location.state?.cadastrado && (
            <p className="login-sucesso">
              Cadastro realizado! Entre com sua matrícula e senha.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Matrícula</label>
              <input type="text" name="matricula" placeholder="Matrícula" value={valores.matricula} onChange={handleChange}/>
              {erros.matricula && (<span className="campo-erro">{erros.matricula}</span>
)}
            </div>

            <div className="login-field">
              <label>Senha</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} name="senha" placeholder="Senha" value={valores.senha} onChange={handleChange}/>
                {erros.senha && (<span className="campo-erro">{erros.senha}</span>
)}
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁" : "👁"}
                </button>
            
              </div>
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" checked={continuarConectado} onChange={(e) => setContinuarConectado(e.target.checked)}/>
                Continuar Conectado
              </label>
              <a href="#">Esqueci minha Senha</a>
            </div>

            <button type="submit" className="login-button" disabled={enviando}>
             {enviando ? "Enviando..." : "Acessar"} 
            </button>
            {erros.aviso && (<span className="campo-erro">{erros.aviso}</span>
)}
          </form>

          <p className="login-cadastro">
            Não possui uma conta ainda? <Link to="/register">Cadastre-se</Link>
          </p>
        </div>
      </div>
      <p className="login-footer">Fundação Edson Queiroz | UniFit</p>
    </div>
  );
}
export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logo.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) { // function that navigate through login to "menu"
    e.preventDefault();
    sessionStorage.setItem("logado", "true");
    navigate("/home");
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
          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Matrícula</label>  
              <input type="text" placeholder="Matrícula"/>
            </div>

            <div className="login-field">
              <label>Senha</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} placeholder="Senha" />
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
                <input type="checkbox" />
                Continuar Conectado
              </label>
              <a href="#">Esqueci minha Senha</a>
            </div>
            <button type="submit" className="login-button">
              Acessar
            </button>
          </form>
        </div>
      </div>
      <p className="login-footer">Fundação Edson Queiroz | UniFit</p>
    </div>
  );
}
export default Login;
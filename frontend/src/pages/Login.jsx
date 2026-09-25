import { useState } from "react";
import "../styles/Login.css";
import logo from "../assets/logo.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="login-banner">
        <span className="login-banner-logo">UniFit</span>
      </div>
      <div className="login-form-side">
        <div className="login-card">
          <img src={logo} alt="UniFit" className="login-icon" />
          <h1 className="login-title">Acesse sua conta UniFit</h1>
          <p className="login-subtitle">Entre para montar seus treinos</p>

          <form>
            <div className="login-field">
              <label>Matrícula</label>
              <input type="email" placeholder="Matrícula"/>
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
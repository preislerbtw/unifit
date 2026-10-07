import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logo.png";
import { listarProfessores } from "../services/professoresApi";
import { setSession, DEMO_STUDENTS } from "../services/session";
import { levelLabel } from "../utils/levels";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [professors, setProfessors] = useState([]);
  // "student:<userId>" | "professor:<id>" | "admin"
  const [profile, setProfile] = useState(`student:${DEMO_STUDENTS[0].userId}`);

  useEffect(() => {
    listarProfessores().then(setProfessors);
  }, []);

  // MODO DEMONSTRAÇÃO: quando o login do back-end existir, o perfil virá da API
  function handleSubmit(e) {
    e.preventDefault();
    const [kind, value] = profile.split(":");

    if (kind === "student") {
      const student = DEMO_STUDENTS.find((s) => s.userId === value);
      setSession({ role: "aluno", ...student });
      navigate("/home");
    } else if (kind === "professor") {
      const prof = professors.find((p) => String(p.id) === value);
      setSession({
        role: "professor",
        userId: `professor-${prof.id}`,
        professorId: prof.id,
        name: prof.nome,
      });
      navigate("/painel");
    } else {
      setSession({ role: "admin", userId: "admin-1", name: "Administrador" });
      navigate("/painel");
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
              <input type="text" placeholder="Matrícula" />
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

            <div className="login-field">
              <label htmlFor="login-profile">Entrar como (demonstração)</label>
              <select
                id="login-profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              >
                {DEMO_STUDENTS.map((s) => (
                  <option key={s.userId} value={`student:${s.userId}`}>
                    Aluno: {s.name} ({levelLabel(s.level)})
                  </option>
                ))}
                {professors.map((p) => (
                  <option key={p.id} value={`professor:${p.id}`}>
                    Professor: {p.nome}
                  </option>
                ))}
                <option value="admin">Administrador</option>
              </select>
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

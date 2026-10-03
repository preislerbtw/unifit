import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";
import "../styles/Register.css";
import logo from "../assets/logo.png";

const inicial = {
  nome: "",
  matricula: "",
  email: "",
  curso: "",
  senha: "",
  confirmar: "",
};

function validar(v) {
  const erros = {};

  if (v.nome.trim().split(/\s+/).length < 2) {
    erros.nome = "Informe seu nome e sobrenome.";
  }
  if (!/^\d{6,10}$/.test(v.matricula)) {
    erros.matricula = "A matrícula deve ter apenas números (mínimo 6).";
  }
  if (!/^[^\s@]+@edu\.unifor\.br$/i.test(v.email.trim())) {
    erros.email = "Use seu e-mail institucional (@edu.unifor.br).";
  }
  if (!v.curso.trim()) {
    erros.curso = "Informe seu curso.";
  }
  if (v.senha.length < 6) {
    erros.senha = "A senha deve ter pelo menos 6 caracteres.";
  }
  if (v.confirmar !== v.senha) {
    erros.confirmar = "As senhas não coincidem.";
  }

  return erros;
}

function Campo({ label, erro, children }) {
  return (
    <div className="login-field">
      <label>{label}</label>
      {children}
      {erro && <span className="campo-erro">{erro}</span>}
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [valores, setValores] = useState(inicial);
  const [erros, setErros] = useState({});
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: value }));
    setErros((er) => ({ ...er, [name]: undefined })); // limpa o erro do campo
  }

  function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validar(valores);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    navigate("/", { state: { cadastrado: true } });
  }

  return (
    <div className="login-page">
      <div className="login-banner">
        <img src={logo} alt="UniFit" className="login-banner-logo" />
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <h1 className="login-title">Crie sua conta UniFit</h1>
          <p className="login-subtitle">Preencha seus dados para começar</p>

          <form onSubmit={handleSubmit} noValidate>
            <Campo label="Nome completo" erro={erros.nome}>
              <input
                type="text"
                name="nome"
                placeholder="Seu Nome Completo"
                value={valores.nome}
                onChange={handleChange}
              />
            </Campo>

            <div className="cadastro-row">
              <Campo label="Matrícula" erro={erros.matricula}>
                <input
                  type="text"
                  name="matricula"
                  inputMode="numeric"
                  placeholder="Matrícula"
                  value={valores.matricula}
                  onChange={handleChange}
                />
              </Campo>

              <Campo label="Curso" erro={erros.curso}>
                <input
                  type="text"
                  name="curso"
                  placeholder="Ex: Direito"
                  value={valores.curso}
                  onChange={handleChange}
                />
              </Campo>
            </div>

            <Campo label="E-mail institucional" erro={erros.email}>
              <input
                type="email"
                name="email"
                placeholder="seunome@edu.unifor.br"
                value={valores.email}
                onChange={handleChange}
              />
            </Campo>

            <Campo label="Senha" erro={erros.senha}>
              <div className="password-wrapper">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  placeholder="Sua Senha"
                  value={valores.senha}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setMostrarSenha((m) => !m)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Campo>

            <Campo label="Confirmar senha" erro={erros.confirmar}>
              <input
                type={mostrarSenha ? "text" : "password"}
                name="confirmar"
                placeholder="Repita a Senha"
                value={valores.confirmar}
                onChange={handleChange}
              />
            </Campo>

            <button type="submit" className="login-button">
              Criar conta
            </button>
          </form>

          <p className="login-cadastro">
            Já tem conta?  <Link to="/"><span className="entrar"> Entrar</span></Link>
          </p>
        </div>
      </div>

      <p className="login-footer">Fundação Edson Queiroz | UniFit</p>
    </div>
  );
}

export default Register;
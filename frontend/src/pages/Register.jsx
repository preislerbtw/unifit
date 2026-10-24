import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import banner from "../assets/foto_unifor.jpg";
import { cadastrar } from "../services/authApi";

const inicial = {
  nome: "",
  matricula: "",
  email: "",
  curso: "",
  senha: "",
  confirmar: "",
};

const INPUT_CLASS =
  "w-full px-3.5 py-3 border border-[var(--border)] rounded-lg text-sm box-border focus:outline-none focus:border-[var(--text-primary)]";

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
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      {children}
      {erro && <span className="block mt-1.5 text-xs text-[var(--text-danger)]">{erro}</span>}
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [valores, setValores] = useState(inicial);
  const [erros, setErros] = useState({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValores((v) => ({ ...v, [name]: value }));
    setErros((er) => ({ ...er, [name]: undefined })); // limpa o erro do campo
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const novosErros = validar(valores);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setEnviando(true);
    try {
      await cadastrar({
        nome: valores.nome,
        email: valores.email,
        senha: valores.senha,
        matricula: valores.matricula,
        curso: valores.curso,
        perfil: "aluno",
      });
      navigate("/", { state: { cadastrado: true } });
    } catch (err) {
      setErros((er) => ({
        ...er,
        geral: err.message || "Não foi possível cadastrar. Tente novamente.",
      }));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex relative min-h-screen w-full">
      <div
        className="flex-[1.5] relative min-h-screen bg-cover bg-center max-[900px]:hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[rgba(15,40,120,0.75)] before:to-[rgba(30,90,220,0.55)]"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <img src={logo} alt="UniFit" className="relative z-[1] h-[50px] w-auto m-8 brightness-0 invert" />
      </div>

      <div className="flex-1 flex items-center justify-center bg-[var(--bg-page)] p-5">
        <div className="bg-[var(--bg-surface)] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-12 py-10 w-full max-w-[480px] max-[520px]:p-8 max-[520px]:px-6">
          <h1 className="text-center text-[22px] font-bold mb-1.5">Crie sua conta UniFit</h1>
          <p className="text-center text-[var(--text-muted)] text-sm mb-8">Preencha seus dados para começar</p>

          {erros.geral && (
            <p className="mb-5 px-3.5 py-2.5 rounded-lg bg-[var(--bg-danger)] text-[var(--text-danger)] text-sm text-center">
              {erros.geral}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Campo label="Nome completo" erro={erros.nome}>
              <input
                type="text"
                name="nome"
                placeholder="Seu Nome Completo"
                value={valores.nome}
                onChange={handleChange}
                className={INPUT_CLASS}
              />
            </Campo>

            <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
              <Campo label="Matrícula" erro={erros.matricula}>
                <input
                  type="text"
                  name="matricula"
                  inputMode="numeric"
                  placeholder="Matrícula"
                  value={valores.matricula}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                />
              </Campo>

              <Campo label="Curso" erro={erros.curso}>
                <input
                  type="text"
                  name="curso"
                  placeholder="Ex: Direito"
                  value={valores.curso}
                  onChange={handleChange}
                  className={INPUT_CLASS}
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
                className={INPUT_CLASS}
              />
            </Campo>

            <Campo label="Senha" erro={erros.senha}>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  placeholder="Sua Senha"
                  value={valores.senha}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer flex items-center"
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
                className={INPUT_CLASS}
              />
            </Campo>

            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--primary-hover)] text-[var(--text-on-primary)] border-none rounded-lg text-[15px] font-semibold cursor-pointer transition-all duration-[400ms] ease-in-out hover:brightness-[0.7]"
              disabled={enviando}
            >
              {enviando ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
            Já tem conta?{" "}
            <Link to="/" className="text-[var(--text-primary)] font-semibold no-underline">
              <span className="inline-block transition-[filter,transform] duration-[400ms] ease-in-out hover:brightness-[0.7] hover:font-bold hover:scale-[1.03]">
                {" "}Entrar
              </span>
            </Link>
          </p>
        </div>
      </div>

      <p className="absolute bottom-5 left-10 text-[var(--text-on-primary)] text-[13px] max-[900px]:text-[var(--text-muted)] max-[900px]:left-5">
        Fundação Edson Queiroz | UniFit
      </p>
    </div>
  );
}

export default Register;

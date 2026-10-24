import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import banner from "../assets/foto_unifor.jpg";
import { setSession, sessaoDeUsuario } from "../services/session";
import { login } from "../services/authApi";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const usuario = await login(matricula, senha);
      const sessao = sessaoDeUsuario(usuario);
      setSession(sessao);
      navigate(sessao.role === "aluno" ? "/home" : "/painel");
    } catch (err) {
      setErro(err.message || "Matrícula ou senha incorretos.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex relative min-h-screen w-full">
      <div
        className="flex-[1.5] relative min-h-screen bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-[rgba(15,40,120,0.75)] before:to-[rgba(30,90,220,0.55)]"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <img src={logo} alt="UniFit" className="relative z-[1] h-[50px] w-auto m-8 brightness-0 invert" />
      </div>
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-page)] p-5">
        <div className="bg-[var(--bg-surface)] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-12 w-full max-w-[420px]">
          <img src="/icon-unifor.webp" alt="Unifor" className="w-[90px] h-[90px] object-contain bg-transparent mx-auto mb-4 block" />
          <h1 className="text-center text-[22px] font-bold mb-1.5">Acesse sua conta UniFit</h1>
          <p className="text-center text-[var(--text-muted)] text-sm mb-8">Entre para montar seus treinos</p>

          {location.state?.cadastrado && (
            <p className="mb-5 px-3.5 py-2.5 rounded-lg bg-[var(--bg-success)] text-[var(--text-success)] text-sm text-center">
              Cadastro realizado! Entre com sua matrícula e senha.
            </p>
          )}

          {erro && (
            <p className="mb-5 px-3.5 py-2.5 rounded-lg bg-[var(--bg-danger)] text-[var(--text-danger)] text-sm text-center">
              {erro}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1.5">Matrícula</label>
              <input
                type="text"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full px-3.5 py-3 border border-[var(--border)] rounded-lg text-sm box-border focus:outline-none focus:border-[var(--text-primary)]"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-3.5 py-3 border border-[var(--border)] rounded-lg text-sm box-border focus:outline-none focus:border-[var(--text-primary)]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm mb-7">
              <label className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <input type="checkbox" />
                Continuar Conectado
              </label>
              <a href="#" className="text-[var(--text-primary)] no-underline">Esqueci minha Senha</a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[var(--primary)] text-[var(--text-on-primary)] border-none rounded-lg text-[15px] font-semibold cursor-pointer"
              disabled={enviando}
            >
              {enviando ? "Entrando..." : "Acessar"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
            Não possui uma conta ainda?{" "}
            <Link to="/register" className="text-[var(--text-primary)] font-semibold no-underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
      <p className="absolute bottom-5 left-10 text-[var(--text-on-primary)] text-[13px]">
        Fundação Edson Queiroz | UniFit
      </p>
    </div>
  );
}

export default Login;

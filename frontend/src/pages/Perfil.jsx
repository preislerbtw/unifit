import { useState } from "react";
import "../styles/Perfil.css";
import { CircleUserRound } from "lucide-react";
import { getSession, setSession } from "../services/session";
import { atualizarMedidas } from "../services/authApi";

// aceita "72,5"/"72.5"
function paraNumero(valor) {
  return Number(String(valor).trim().replace(",", "."));
}

function Perfil() {
  const [usuario, setUsuario] = useState(getSession());
  const [editando, setEditando] = useState(false);
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [erro, setErro] = useState("");
  const [salvo, setSalvo] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // so quem logou pelo banco tem idUsuario e pode salvar
  const podeEditar = usuario.idUsuario != null;

  function abrirEdicao() {
    setPeso(usuario.peso != null ? String(usuario.peso) : "");
    setAltura(usuario.altura != null ? Number(usuario.altura).toFixed(2) : "");
    setErro("");
    setSalvo(false);
    setEditando(true);
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");

    const p = paraNumero(peso);
    const a = paraNumero(altura);

    if (!Number.isFinite(p) || p < 20 || p > 300) {
      setErro("Informe um peso válido em kg (entre 20 e 300).");
      return;
    }
    if (!Number.isFinite(a) || a < 1 || a > 2.5) {
      setErro("Informe a altura em metros (ex.: 1,75).");
      return;
    }

    setSalvando(true);
    try {
      const medidas = await atualizarMedidas(usuario.idUsuario, p, a);
      const atualizado = { ...usuario, ...medidas };
      setSession(atualizado); // mantem a sessão em dia
      setUsuario(atualizado);
      setEditando(false);
      setSalvo(true);
    } catch (err) {
      setErro(err.message || "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="perfil-page">
      <div className="perfil-avatar">
        <CircleUserRound className="icone-perfil" />
      </div>

      <div className="perfil-dados">
        <div className="dado-box">
          <span className="dado-label">Nome</span>
          <span className="dado-valor">{usuario.name || "—"}</span>
        </div>

        {usuario.curso && (
          <div className="dado-box">
            <span className="dado-label">Curso</span>
            <span className="dado-valor">{usuario.curso}</span>
          </div>
        )}

        {usuario.matricula && (
          <div className="dado-box">
            <span className="dado-label">Matrícula</span>
            <span className="dado-valor">{usuario.matricula}</span>
          </div>
        )}

        {usuario.email && (
          <div className="dado-box">
            <span className="dado-label">Email</span>
            <span className="dado-valor">{usuario.email}</span>
          </div>
        )}

        {usuario.idUsuario != null && (
          <div className="dado-box">
            <span className="dado-label">ID do Usuário</span>
            <span className="dado-valor">
              {String(usuario.idUsuario).padStart(4, "0")}
            </span>
          </div>
        )}

        {/* peso e altura: so sao preenchidos aqui no perfil */}
        {editando ? (
          <form className="perfil-form" onSubmit={salvar} noValidate>
            <div className="dado-box">
              <label className="dado-label" htmlFor="perfil-peso">
                Peso (kg)
              </label>
              <input
                id="perfil-peso"
                className="perfil-input"
                type="text"
                inputMode="decimal"
                placeholder="Ex: 72,5"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                autoFocus
              />
            </div>

            <div className="dado-box">
              <label className="dado-label" htmlFor="perfil-altura">
                Altura (m)
              </label>
              <input
                id="perfil-altura"
                className="perfil-input"
                type="text"
                inputMode="decimal"
                placeholder="Ex: 1,75"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
              />
            </div>

            {erro && <p className="perfil-erro">{erro}</p>}

            <div className="perfil-acoes">
              <button
                type="button"
                className="perfil-btn perfil-btn-secundario"
                onClick={() => setEditando(false)}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="perfil-btn perfil-btn-primario"
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="dado-box">
              <span className="dado-label">Peso</span>
              <span className="dado-valor">
                {usuario.peso != null ? `${usuario.peso} KG` : "—"}
              </span>
            </div>

            <div className="dado-box">
              <span className="dado-label">Altura</span>
              <span className="dado-valor">
                {usuario.altura != null
                  ? `${Number(usuario.altura).toFixed(2)} M`
                  : "—"}
              </span>
            </div>

            {salvo && <p className="perfil-sucesso">Dados salvos!</p>}

            {podeEditar && (
              <button
                type="button"
                className="perfil-btn perfil-btn-primario"
                onClick={abrirEdicao}
              >
                {usuario.peso != null || usuario.altura != null
                  ? "Editar peso e altura"
                  : "Adicionar peso e altura"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Perfil;
import { useState } from "react";
import { CircleUserRound } from "lucide-react";
import { getSession, setSession } from "../services/session";
import { atualizarMedidas } from "../services/authApi";

const DADO_BOX =
  "bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 flex flex-col gap-1 transition-all duration-200 ease-in-out hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]";
const DADO_LABEL = "text-xs font-semibold uppercase tracking-[0.05em] text-[var(--text-muted)]";
const DADO_VALOR = "text-[0.95rem] font-medium text-[var(--text)] break-all";
const PERFIL_BTN =
  "flex-1 px-4 py-2.5 border border-transparent rounded-lg text-[0.95rem] font-semibold cursor-pointer transition-opacity duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed";
const PERFIL_BTN_PRIMARIO = "bg-[var(--accent)] text-white";
const PERFIL_BTN_SECUNDARIO = "bg-transparent text-[var(--text)] border-[var(--border)]";

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
    <div className="max-w-[450px] mx-auto my-[60px] pt-[72px] px-6 pb-8 bg-[var(--bg-surface)] rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col items-center transition-[transform,box-shadow] duration-200 ease-in-out relative">
      <div>
        <CircleUserRound className="w-16 h-16 text-[var(--accent)]" />
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className={DADO_BOX}>
          <span className={DADO_LABEL}>Nome</span>
          <span className={DADO_VALOR}>{usuario.name || "—"}</span>
        </div>

        {usuario.curso && (
          <div className={DADO_BOX}>
            <span className={DADO_LABEL}>Curso</span>
            <span className={DADO_VALOR}>{usuario.curso}</span>
          </div>
        )}

        {usuario.matricula && (
          <div className={DADO_BOX}>
            <span className={DADO_LABEL}>Matrícula</span>
            <span className={DADO_VALOR}>{usuario.matricula}</span>
          </div>
        )}

        {usuario.email && (
          <div className={DADO_BOX}>
            <span className={DADO_LABEL}>Email</span>
            <span className={DADO_VALOR}>{usuario.email}</span>
          </div>
        )}

        {usuario.idUsuario != null && (
          <div className={DADO_BOX}>
            <span className={DADO_LABEL}>ID do Usuário</span>
            <span className={DADO_VALOR}>
              {String(usuario.idUsuario).padStart(4, "0")}
            </span>
          </div>
        )}

        {/* peso e altura: so sao preenchidos aqui no perfil */}
        {editando ? (
          <form className="flex flex-col gap-4" onSubmit={salvar} noValidate>
            <div className={DADO_BOX}>
              <label className={DADO_LABEL} htmlFor="perfil-peso">
                Peso (kg)
              </label>
              <input
                id="perfil-peso"
                className="w-full box-border px-2.5 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text)] text-[0.95rem] focus:outline-none focus:border-[var(--accent)]"
                type="text"
                inputMode="decimal"
                placeholder="Ex: 72,5"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                autoFocus
              />
            </div>

            <div className={DADO_BOX}>
              <label className={DADO_LABEL} htmlFor="perfil-altura">
                Altura (m)
              </label>
              <input
                id="perfil-altura"
                className="w-full box-border px-2.5 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text)] text-[0.95rem] focus:outline-none focus:border-[var(--accent)]"
                type="text"
                inputMode="decimal"
                placeholder="Ex: 1,75"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
              />
            </div>

            {erro && (
              <p className="m-0 px-3 py-2.5 rounded-lg bg-[#fee2e2] text-[#b91c1c] text-[0.85rem] text-center">
                {erro}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                className={`${PERFIL_BTN} ${PERFIL_BTN_SECUNDARIO}`}
                onClick={() => setEditando(false)}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`${PERFIL_BTN} ${PERFIL_BTN_PRIMARIO}`}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className={DADO_BOX}>
              <span className={DADO_LABEL}>Peso</span>
              <span className={DADO_VALOR}>
                {usuario.peso != null ? `${usuario.peso} KG` : "—"}
              </span>
            </div>

            <div className={DADO_BOX}>
              <span className={DADO_LABEL}>Altura</span>
              <span className={DADO_VALOR}>
                {usuario.altura != null
                  ? `${Number(usuario.altura).toFixed(2)} M`
                  : "—"}
              </span>
            </div>

            {salvo && (
              <p className="m-0 px-3 py-2.5 rounded-lg bg-[#dcfce7] text-[#166534] text-[0.85rem] text-center">
                Dados salvos!
              </p>
            )}

            {podeEditar && (
              <button
                type="button"
                className={`${PERFIL_BTN} ${PERFIL_BTN_PRIMARIO}`}
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

import { useState, useEffect, useMemo } from "react";
import { Search, CalendarPlus, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "../components/AppointmentModal";
import { listarProfessores, criarAgendamento, } from "../services/professoresApi";
import "../styles/Professors.css";
import Button from "../components/Button";

// ex: "profa. ana beatriz lima" -> "AL"
function iniciais(nome) {
  const partes = nome
    .replace(/^Profa?\.\s*/i, "")
    .split(" ")
    .filter(Boolean);
  return (partes[0][0] + (partes[partes.length - 1][0] || "")).toUpperCase();
}

// "2026-10-05" -> "05/10/2026"
function formatarData(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function Professores() {
  const navigate = useNavigate();
  const [professores, setProfessores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null); // professor do modal
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    listarProfessores()
      .then(setProfessores)
      .catch((err) => console.error(err))
      .finally(() => setCarregando(false));
  }, []);

  // some o aviso depois de 5 segundos
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(""), 5000);
    return () => clearTimeout(t);
  }, [aviso]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return professores;
    return professores.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.especialidade.toLowerCase().includes(termo),
    );
  }, [busca, professores]);

  async function confirmarAgendamento(dados) {
    await criarAgendamento(dados);
    const prof = professores.find((p) => p.id === dados.professorId);
    setSelecionado(null);
    setAviso(
      `${dados.tipo} solicitada com ${prof.nome} para ${formatarData(
        dados.data,
      )} às ${dados.horario}.`,
    );
  }

  function conversar(prof) {
    // TODO (RF15): abrir o chat com o professor, por exemplo navigate(`/chat/${prof.id}`)
    setAviso(`O chat com ${prof.nome} será liberado na próxima etapa.`);
  }

  return (
    <div className="professors-page">
      <Button
        className="btn-voltar"
        type="button"
        onClick={() => navigate("/home")}
      >
        Voltar
      </Button>

      <h1>Professores</h1>
      <p className="professors-subtitle">
        Conheça os professores, agende uma avaliação física ou aula e converse
        com eles.
      </p>

      <div className="professors-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Buscar por nome ou especialidade"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {aviso && (
        <p className="professors-notice" role="status">
          {aviso}
        </p>
      )}

      {carregando && <p>Carregando professores...</p>}

      {!carregando && (
        <div className="professors-grid">
          {filtrados.length > 0 ? (
            filtrados.map((p) => (
              <article key={p.id} className="professor-card">
                <div className="professor-header">
                  <div className="professor-avatar" aria-hidden="true">
                    {iniciais(p.nome)}
                  </div>
                  <div>
                    <h3>{p.nome}</h3>
                    <span className="professor-tag">{p.especialidade}</span>
                  </div>
                </div>

                <p className="professor-gym">
                  <MapPin size={14} /> {p.academia}
                </p>
                <p className="professor-bio">{p.bio}</p>

                <div className="professor-actions">
                  <button
                    className="prof-btn prof-btn-primary"
                    onClick={() => setSelecionado(p)}
                  >
                    <CalendarPlus size={16} /> Agendar
                  </button>
                  <button
                    className="prof-btn prof-btn-secondary"
                    onClick={() => conversar(p)}
                  >
                    <MessageCircle size={16} /> Conversar
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p>Nenhum professor encontrado.</p>
          )}
        </div>
      )}

      {selecionado && (
        <AppointmentModal
          professor={selecionado}
          onClose={() => setSelecionado(null)}
          onConfirm={confirmarAgendamento}
        />
      )}
    </div>
  );
}

export default Professores;

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CalendarPlus, MessageCircle, MapPin, Plus } from "lucide-react";
import AppointmentModal from "../components/AppointmentModal";
import AddByCodeModal from "../components/AddByCodeModal";
import { listarMeusProfessores, adicionarProfessor } from "../services/professoresApi";
import { getSession } from "../services/session";
import { createAppointment } from "../services/appointmentsApi";
import {
  PROF_PAGE,
  PROF_SUBTITLE,
  PROF_SEARCH,
  PROF_SEARCH_INPUT,
  PROF_NOTICE,
  PROF_GRID,
  PROFESSOR_CARD,
  PROFESSOR_HEADER,
  PROFESSOR_HEADER_H3,
  PROFESSOR_AVATAR,
  PROFESSOR_TAG,
  PROFESSOR_GYM,
  PROFESSOR_BIO,
  PROFESSOR_ACTIONS,
  PROF_BTN,
  PROF_BTN_PRIMARY,
  PROF_BTN_SECONDARY,
} from "../styles/professorsClasses";

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

function Professors() {
  const navigate = useNavigate();
  const [session] = useState(getSession);

  const [professores, setProfessores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(null); // professor do modal
  const [adicionando, setAdicionando] = useState(false); // modal do código
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    listarMeusProfessores(session.idUsuario)
      .then(setProfessores)
      .catch((err) => console.error(err))
      .finally(() => setCarregando(false));
  }, [session.idUsuario]);

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
        (p.especialidade ?? "").toLowerCase().includes(termo),
    );
  }, [busca, professores]);

  async function confirmarAgendamento(dados) {
    const prof = professores.find((p) => p.id === dados.professorId);

    // salva o agendamento para aparecer na página Agenda
    await createAppointment({
      professorId: dados.professorId,
      professorName: prof.nome,
      gym: prof.academia,
      type: dados.tipo,
      date: dados.data,
      time: dados.horario,
    });

    setSelecionado(null);
    setAviso(
      `${dados.tipo} solicitada com ${prof.nome} para ${formatarData(
        dados.data,
      )} às ${dados.horario}. Acompanhe na Agenda.`,
    );
  }

  async function confirmarProfessor(codigo) {
    const prof = await adicionarProfessor(session.idUsuario, codigo);
    setProfessores((lista) =>
      [...lista, prof].sort((a, b) => a.nome.localeCompare(b.nome)),
    );
    setAdicionando(false);
    setAviso(`${prof.nome} foi adicionado aos seus professores.`);
  }

  function conversar(prof) {
    // o chat usa o id de usuário do professor
    navigate(`/chat/${prof.usuarioId}`);
  }

  return (
    <div className={PROF_PAGE}>
      <div className="flex items-center justify-between gap-4 mb-1">
        <h1>Professores</h1>
        <button
          className={`${PROF_BTN} ${PROF_BTN_PRIMARY} flex-none`}
          onClick={() => setAdicionando(true)}
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>
      <p className={PROF_SUBTITLE}>
        Adicione seus professores pelo código, agende uma avaliação física ou
        aula e converse com eles.
      </p>

      <div className={PROF_SEARCH}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Buscar por nome ou especialidade"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={PROF_SEARCH_INPUT}
        />
      </div>

      {aviso && (
        <p className={PROF_NOTICE} role="status">
          {aviso}
        </p>
      )}

      {carregando && <p>Carregando professores...</p>}

      {!carregando && (
        <div className={PROF_GRID}>
          {filtrados.length > 0 ? (
            filtrados.map((p) => (
              <article key={p.id} className={PROFESSOR_CARD}>
                <div className={PROFESSOR_HEADER}>
                  <div className={PROFESSOR_AVATAR} aria-hidden="true">
                    {iniciais(p.nome)}
                  </div>
                  <div>
                    <h3 className={PROFESSOR_HEADER_H3}>{p.nome}</h3>
                    <span className={PROFESSOR_TAG}>{p.especialidade}</span>
                  </div>
                </div>

                <p className={PROFESSOR_GYM}>
                  <MapPin size={14} /> {p.academia}
                </p>
                <p className={PROFESSOR_BIO}>{p.bio}</p>

                <div className={PROFESSOR_ACTIONS}>
                  <button
                    className={`${PROF_BTN} ${PROF_BTN_PRIMARY}`}
                    onClick={() => setSelecionado(p)}
                  >
                    <CalendarPlus size={16} /> Agendar
                  </button>
                  <button
                    className={`${PROF_BTN} ${PROF_BTN_SECONDARY}`}
                    onClick={() => conversar(p)}
                  >
                    <MessageCircle size={16} /> Conversar
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p>
              {professores.length === 0
                ? "Você ainda não adicionou nenhum professor. Clique em Adicionar e digite o código dele."
                : "Nenhum professor encontrado."}
            </p>
          )}
        </div>
      )}

      {adicionando && (
        <AddByCodeModal
          title="Adicionar professor"
          subtitle="Peça ao professor o código que aparece no perfil dele."
          onClose={() => setAdicionando(false)}
          onConfirm={confirmarProfessor}
        />
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

export default Professors;

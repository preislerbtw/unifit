import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllExercises, filterExercises } from "../services/catalogApi";
import { trBodyPart, trEquipment, trLevel } from "../utils/translations";

const SEARCH_ICON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236b7280' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E\")";

const POR_PAGINA = 48;

function Exercises() {
  const [busca, setBusca] = useState("");
  const [todos, setTodos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [limite, setLimite] = useState(POR_PAGINA);
  const [tentativa, setTentativa] = useState(0);
  const navigate = useNavigate();

  // carrega o catálogo completo (1 requisição; depois vem do cache)
  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro(false);

    getAllExercises()
      .then((lista) => !cancelado && setTodos(lista))
      .catch((err) => {
        console.error(err);
        if (!cancelado) setErro(true);
      })
      .finally(() => !cancelado && setCarregando(false));

    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  const resultados = useMemo(() => filterExercises(todos, busca), [todos, busca]);
  const visiveis = resultados.slice(0, limite);

  function aoDigitar(e) {
    setBusca(e.target.value);
    setLimite(POR_PAGINA); // volta ao início a cada busca nova
  }

  return (
    <div className="flex-1 px-10 py-8 bg-[var(--bg-page)] max-md:p-5">
      <div className="mb-7 relative max-w-[480px]">
        <input
          type="text"
          placeholder="Buscar exercício (ex: su, agachamento, halter, peito...)"
          value={busca}
          onChange={aoDigitar}
          autoFocus
          className="w-full py-3.5 px-4 pl-11 border border-[var(--border)] rounded-[10px] text-sm bg-[var(--bg-surface)] bg-no-repeat transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[var(--text-primary)] focus:shadow-[0_0_0_3px_var(--focus-ring)]"
          style={{ backgroundImage: SEARCH_ICON, backgroundPosition: "14px center" }}
        />
      </div>

      {carregando && <p>Carregando exercícios...</p>}

      {erro && (
        <p>
          Não foi possível carregar os exercícios.{" "}
          <button type="button" onClick={() => setTentativa((n) => n + 1)}>
            Tentar novamente
          </button>
        </p>
      )}

      {!carregando && !erro && (
        <>
          <p>
            {resultados.length} exercício{resultados.length === 1 ? "" : "s"}
          </p>

          <div className="grid [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))] gap-[18px] max-md:[grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] max-md:gap-3">
            {visiveis.length > 0 ? (
              visiveis.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[14px] p-[22px] cursor-pointer transition-[box-shadow,transform,border-color] duration-200 ease-in-out hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:-translate-y-[3px] hover:border-[var(--border-accent)] max-md:p-4"
                  onClick={() => navigate(`/exercicios/${ex.id}`, { state: { nomePt: ex.name } })}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-[var(--text-on-primary)] flex items-center justify-center text-sm mb-3.5">
                    ▶
                  </div>
                  <h3 className="text-base font-semibold mb-1.5 text-[var(--text)] capitalize leading-[1.3]">
                    {ex.name}
                  </h3>
                  <p className="text-[13px] text-[var(--text-muted)] capitalize mb-3">
                    {trBodyPart(ex.bodyPart)} · {trEquipment(ex.equipment)}
                  </p>
                  <span className="inline-block px-2.5 py-[3px] bg-[var(--bg-primary-subtle)] text-[var(--text-primary)] rounded-[20px] text-[11px] font-semibold capitalize">
                    {trLevel(ex.difficulty)}
                  </span>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-[var(--text-faint)] text-sm py-10">
                Nenhum exercício encontrado.
              </p>
            )}
          </div>

          {resultados.length > limite && (
            <button
              type="button"
              onClick={() => setLimite((n) => n + POR_PAGINA)}
            >
              Ver mais ({resultados.length - limite} restantes)
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Exercises;

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllExercises, filterExercises } from "../services/catalogApi";
import { trBodyPart, trEquipment, trLevel } from "../utils/translations";
import "../styles/Exercises.css";

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
    <div className="exercicios-page">
      <div className="exercicios-search">
        <input
          type="text"
          placeholder="Buscar exercício (ex: su, agachamento, halter, peito...)"
          value={busca}
          onChange={aoDigitar}
          autoFocus
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
          <p className="exercicios-contador">
            {resultados.length} exercício{resultados.length === 1 ? "" : "s"}
          </p>

          <div className="exercicios-grid">
            {visiveis.length > 0 ? (
              visiveis.map((ex) => (
                <div
                  key={ex.id}
                  className="exercicio-card"
                  onClick={() => navigate(`/exercicios/${ex.id}`, { state: { nomePt: ex.name } })}
                >
                  <div className="exercicio-play">▶</div>
                  <h3>{ex.name}</h3>
                  <p>
                    {trBodyPart(ex.bodyPart)} · {trEquipment(ex.equipment)}
                  </p>
                  <span className="exercicio-dificuldade">{trLevel(ex.difficulty)}</span>
                </div>
              ))
            ) : (
              <p className="exercicios-vazio">Nenhum exercício encontrado.</p>
            )}
          </div>

          {resultados.length > limite && (
            <button
              type="button"
              className="exercicios-mais"
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
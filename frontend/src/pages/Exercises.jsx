import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { buscarExercicios, listarTodosExercicios } from "../services/exerciseApi";
import { traduzirTermoBusca } from "../utils/ExcercisesTraduct";
import { PopularExercises } from "../utils/PopularExercises";
import "../styles/Exercises.css";

function Exercises() {
  const [busca, setBusca] = useState("");
  const [populares, setPopulares] = useState([]);
  const [todosExercicios, setTodosExercicios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const navigate = useNavigate();

  // carrega os exercícios populares assim que a página abre
  useEffect(() => {
    async function carregarPopulares() {
      setCarregando(true);
      setErro(false);
      try {
        const resultados = await Promise.all(
          PopularExercises.map(async (item) => {
            const encontrados = await buscarExercicios(item.match);
            if (encontrados && encontrados.length > 0) {
              return { ...encontrados[0], nomePt: item.pt };
            }
            return null;
          })
        );
        setPopulares(resultados.filter(Boolean));
      } catch (err) {
        console.error(err);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregarPopulares();
  }, []);

  // carrega uma base maior só quando o usuário começa a digitar (busca livre)
  useEffect(() => {
    if (!busca.trim() || todosExercicios.length > 0) return;

    async function carregarTodos() {
      try {
        const dados = await listarTodosExercicios();
        setTodosExercicios(dados);
      } catch (err) {
        console.error(err);
      }
    }
    carregarTodos();
  }, [busca, todosExercicios.length]);

  const exerciciosFiltrados = useMemo(() => {
    if (!busca.trim()) return populares;

    const termoTraduzido = traduzirTermoBusca(busca);
    return todosExercicios.filter((ex) =>
      ex.name.toLowerCase().includes(termoTraduzido)
    );
  }, [busca, todosExercicios, populares]);

  return (
    <div className="exercicios-page">
      <div className="exercicios-search">
        <input
          type="text"
          placeholder="Buscar exercício pelo nome (ex: supino, agachamento...)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando && <p>Carregando exercícios...</p>}
      {erro && <p>Não foi possível carregar os exercícios. Tente novamente.</p>}

      {!carregando && !erro && (
        <div className="exercicios-grid">
          {exerciciosFiltrados.length > 0 ? (
            exerciciosFiltrados.map((ex) => (
              <div
                key={ex.id}
                className="exercicio-card"
                onClick={() => navigate(`/exercicios/${ex.id}`)}
              >
                <div className="exercicio-play">▶</div>
                <h3>{ex.nomePt || ex.name}</h3>
                <p>
                  {ex.bodyPart} · {ex.equipment}
                </p>
                <span className="exercicio-dificuldade">{ex.difficulty}</span>
              </div>
            ))
          ) : (
            <p className="exercicios-vazio">Nenhum exercício encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Exercises;
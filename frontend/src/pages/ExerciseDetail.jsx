import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { buscarExercicioPorId } from "../services/exerciseApi";
import "../styles/ExerciseDetail.css";

function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercicio, setExercicio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(false);
      try {
        const dados = await buscarExercicioPorId(id);
        setExercicio(dados);
      } catch (err) {
        console.error(err);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  function adicionarAFicha() {
    // por enquanto só um alerta — depois conecta com a lógica de fichas (RF12-13)
    alert(`"${exercicio.name}" adicionado à ficha!`);
  }

  if (carregando) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <p style={{ padding: "40px" }}>Carregando exercício...</p>
        <Footer />
      </div>
    );
  }

  if (erro || !exercicio) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ padding: "40px" }}>
          <p>Não foi possível carregar este exercício.</p>
          <button onClick={() => navigate("/exercicios")}>← Voltar ao catálogo</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <div className="exercise-detail-page">
        <button className="voltar-btn" onClick={() => navigate("/exercicios")}>
          ← Voltar
        </button>

        <div className="exercise-detail-grid">
          <div className="exercise-media">
            {exercicio.gifUrl ? (
              <img src={exercicio.gifUrl} alt={exercicio.name} />
            ) : (
              <div className="exercise-media-placeholder">▶ Vídeo da execução</div>
            )}
          </div>

          <div className="exercise-info">
            <h1>{exercicio.name}</h1>
            <div className="exercise-tags">
              <span>{exercicio.bodyPart}</span>
              <span>{exercicio.equipment}</span>
              <span className="tag-dificuldade">{exercicio.difficulty}</span>
            </div>

            <h3>Músculos trabalhados</h3>
            <p>
              <strong>{exercicio.target}</strong> (principal)
              {exercicio.secondaryMuscles?.length > 0 && (
                <>
                  <br />
                  {exercicio.secondaryMuscles.join(", ")} (secundários)
                </>
              )}
            </p>

            <h3>Região do corpo</h3>
            <p>{exercicio.bodyPart}</p>

            <button className="adicionar-btn" onClick={adicionarAFicha}>
              + Adicionar à ficha
            </button>
          </div>
        </div>

        <div className="exercise-steps">
          <h3>Passo a passo</h3>
          <ol>
            {exercicio.instructions?.map((passo, i) => (
              <li key={i}>{passo}</li>
            ))}
          </ol>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ExerciseDetail;
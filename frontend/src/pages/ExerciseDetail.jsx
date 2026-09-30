import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import { buscarExercicioPorId } from "../services/exerciseApi";
import {
  trBodyPart,
  trEquipment,
  trLevel,
  trMuscle,
  translateText,
} from "../utils/translations";
import "../styles/ExerciseDetail.css";

function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const nomePt = location.state?.nomePt;

  const [exercicio, setExercicio] = useState(null);
  const [textos, setTextos] = useState(null); // { nome, passos } em português
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro(false);
      setTextos(null);

      try {
        const dados = await buscarExercicioPorId(id);
        if (cancelado) return;
        setExercicio(dados);
        setCarregando(false);

        // traduz nome e passos sem travar a tela
        const [nome, passos] = await Promise.all([
          nomePt
            ? Promise.resolve(nomePt)
            : translateText(dados.name, { isName: true }),
          Promise.all((dados.instructions || []).map((p) => translateText(p))),
        ]);
        if (!cancelado) setTextos({ nome, passos });
      } catch (err) {
        console.error(err);
        if (!cancelado) {
          setErro(true);
          setCarregando(false);
        }
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [id, nomePt]);

  if (carregando) {
    return <p style={{ padding: "40px" }}>Carregando exercício...</p>;
  }

  if (erro || !exercicio) {
    return (
      <div style={{ padding: "40px" }}>
        <p>Não foi possível carregar este exercício.</p>
        <Button variant="secondary" onClick={() => navigate("/exercicios")}>
          ← Voltar ao catálogo
        </Button>
      </div>
    );
  }

  const titulo = textos?.nome || nomePt || exercicio.name;
  const passos = textos?.passos || exercicio.instructions || [];

  function adicionarAFicha() {
    // por enquanto só um alerta — depois conecta com a lógica de fichas (RF12-13)
    alert(`"${titulo}" adicionado à ficha!`);
  }

  return (
    <div className="exercise-detail-page">
      <Button variant="soft" onClick={() => navigate("/exercicios")}>
        Voltar
      </Button>

      <div className="exercise-detail-grid">
        <div className="exercise-media">
          {exercicio.gifUrl ? (
            <img src={exercicio.gifUrl} alt={titulo} />
          ) : (
            <div className="exercise-media-placeholder">▶ Vídeo da execução</div>
          )}
        </div>

        <div className="exercise-info">
          <h1>{titulo}</h1>
          <div className="exercise-tags">
            <span>{trBodyPart(exercicio.bodyPart)}</span>
            <span>{trEquipment(exercicio.equipment)}</span>
            <span className="tag-dificuldade">{trLevel(exercicio.difficulty)}</span>
          </div>

          <h3>Músculos trabalhados</h3>
          <p>
            <strong>{trMuscle(exercicio.target)}</strong> (principal)
            {exercicio.secondaryMuscles?.length > 0 && (
              <>
                <br />
                {exercicio.secondaryMuscles.map(trMuscle).join(", ")} (secundários)
              </>
            )}
          </p>

          <h3>Região do corpo</h3>
          <p>{trBodyPart(exercicio.bodyPart)}</p>

          {/* <Button onClick={adicionarAFicha}>+ Adicionar à ficha</Button> */}
        </div>
      </div>

      <div className="exercise-steps">
        <h3>Passo a passo</h3>
        <ol>
          {passos.map((passo, i) => (
            <li key={i}>{passo}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ExerciseDetail;
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import { buscarExercicioPorId } from "../services/exerciseApi";
import { exerciseImages } from "../services/exerciseMedia";
import ExerciseDemo from "../components/ExerciseDemo";
import { traduzirNomeExercicio } from "../utils/exerciseNamePt";
import {
  trBodyPart,
  trEquipment,
  trLevel,
  trMuscle,
  translateText,
} from "../utils/translations";
import "../styles/ExerciseDetail.css";

const TERMO =
  "Declaro que li o passo a passo e estou ciente de que a academia não se responsabiliza " +
  "por ferimentos ou lesões decorrentes da execução deste exercício sem o acompanhamento " +
  "de um personal trainer ou professor.";

function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const nomePt = location.state?.nomePt;

  const [exercicio, setExercicio] = useState(null);
  const [textos, setTextos] = useState(null); // { nome, passos } em português
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [aceito, setAceito] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro(false);
      setTextos(null);
      setAceito(false); // cada exercício exige uma nova confirmação

      try {
        const dados = await buscarExercicioPorId(id);
        if (cancelado) return;
        setExercicio(dados);
        setCarregando(false);

        // traduz nome e passos sem travar a tela
        const [nome, passos] = await Promise.all([
          nomePt ?? dados.namePt ?? traduzirNomeExercicio(dados.name).pt,
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

  const titulo = textos?.nome || nomePt || exercicio.namePt || traduzirNomeExercicio(exercicio.name).pt;
  const passos = textos?.passos || exercicio.instructions || [];

  return (
    <div className="exercise-detail-page">
      <Button variant="soft" onClick={() => navigate("/exercicios")}>
        Voltar
      </Button>

      <div className="exercise-detail-grid">
        <div className="exercise-media">
          <ExerciseDemo images={exerciseImages(exercicio)} alt={`Execução: ${titulo}`} />
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

          {/* Quando reativar o botão, bloqueie até o aceite:
          <Button onClick={adicionarAFicha} disabled={!aceito}>+ Adicionar à ficha</Button> */}
        </div>
      </div>

      <div className="exercise-steps">
        <h3>Passo a passo</h3>
        <ol>
          {passos.map((passo, i) => (
            <li key={i}>{passo}</li>
          ))}
        </ol>

        <label className={`exercise-terms ${aceito ? "is-checked" : ""}`}>
          <input
            type="checkbox"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
          />
          <span>{TERMO}</span>
        </label>
        {!aceito && (
          <p className="exercise-terms-hint">Marque a caixa acima para confirmar que você leu e concorda.</p>
        )}
      </div>
    </div>
  );
}

export default ExerciseDetail;
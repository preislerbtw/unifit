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
    <div className="flex-1 p-8">
      <Button variant="soft" className="mb-6" onClick={() => navigate("/exercicios")}>
        Voltar
      </Button>

      <div className="grid grid-cols-2 gap-8 mb-8 max-md:grid-cols-1">
        <div className="flex items-center justify-center">
          <ExerciseDemo images={exerciseImages(exercicio)} alt={`Execução: ${titulo}`} />
        </div>

        <div>
          <h1 className="text-[26px] mb-3">{titulo}</h1>
          <div className="flex gap-2 mb-5">
            <span className="bg-[var(--bg-primary-subtle)] text-[var(--text-primary)] px-2.5 py-1 rounded-md text-xs capitalize">
              {trBodyPart(exercicio.bodyPart)}
            </span>
            <span className="bg-[var(--bg-primary-subtle)] text-[var(--text-primary)] px-2.5 py-1 rounded-md text-xs capitalize">
              {trEquipment(exercicio.equipment)}
            </span>
            <span className="!bg-[var(--bg-warning)] !text-[var(--text-warning)] px-2.5 py-1 rounded-md text-xs capitalize">
              {trLevel(exercicio.difficulty)}
            </span>
          </div>

          <h3 className="text-sm mt-4 mb-1 text-[var(--text-secondary)]">Músculos trabalhados</h3>
          <p className="text-sm text-[var(--text-secondary)] capitalize">
            <strong>{trMuscle(exercicio.target)}</strong> (principal)
            {exercicio.secondaryMuscles?.length > 0 && (
              <>
                <br />
                {exercicio.secondaryMuscles.map(trMuscle).join(", ")} (secundários)
              </>
            )}
          </p>

          <h3 className="text-sm mt-4 mb-1 text-[var(--text-secondary)]">Região do corpo</h3>
          <p className="text-sm text-[var(--text-secondary)] capitalize">{trBodyPart(exercicio.bodyPart)}</p>

          {/* <Button onClick={adicionarAFicha}>+ Adicionar à ficha</Button> */}
        </div>
      </div>

      <div className="bg-[var(--bg-subtle)] rounded-xl p-6">
        <h3 className="mb-3">Passo a passo</h3>
        <ol className="pl-5">
          {passos.map((passo, i) => (
            <li key={i} className="mb-2 text-sm text-[var(--text-secondary)]">{passo}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ExerciseDetail;

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Target, PersonStanding } from "lucide-react";
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

// separa a "Dica:" do restante do passo, para destacá-la visualmente
function splitDica(passo) {
  const match = passo.match(/^(.*?)\s*(Dica:\s*.*)$/is);
  if (!match || !match[1]) return { texto: passo, dica: null };
  return { texto: match[1], dica: match[2] };
}

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
    return <p className="p-10 text-[var(--text-secondary)]">Carregando exercício...</p>;
  }

  if (erro || !exercicio) {
    return (
      <div className="p-10 flex flex-col items-start gap-4">
        <p>Não foi possível carregar este exercício.</p>
        <Button variant="secondary" onClick={() => navigate("/exercicios")}>
          ← Voltar ao catálogo
        </Button>
      </div>
    );
  }

  const titulo =
    textos?.nome ||
    nomePt ||
    exercicio.namePt ||
    traduzirNomeExercicio(exercicio.name).pt;
  const passos = textos?.passos || exercicio.instructions || [];

  const tag =
    "px-3 py-1 rounded-full text-xs font-semibold capitalize bg-[var(--bg-primary-subtle)] text-[var(--text-primary)]";

  return (
    <div className="flex-1 px-10 py-7 max-md:px-4 max-md:pt-[72px]">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <Button
          variant="soft"
          className="self-start inline-flex items-center gap-2"
          onClick={() => navigate("/exercicios")}
        >
          <ArrowLeft size={16} /> Voltar
        </Button>

        {/* hero: demonstração + informações */}
        <section className="grid grid-cols-[1fr_1.1fr] gap-8 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm max-md:grid-cols-1">
          <div className="flex items-center justify-center self-center rounded-xl overflow-hidden [&_img]:block [&_img]:w-full [&_img]:h-auto [&_img]:object-cover">
            <ExerciseDemo
              images={exerciseImages(exercicio)}
              alt={`Execução: ${titulo}`}
            />
          </div>

          <div className="flex flex-col justify-center gap-5">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-3 max-md:text-3xl">
                {titulo}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className={tag}>{trBodyPart(exercicio.bodyPart)}</span>
                <span className={tag}>{trEquipment(exercicio.equipment)}</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-[var(--bg-warning)] text-[var(--text-warning)]">
                  {trLevel(exercicio.difficulty)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-muted)]">
                <Target
                  size={20}
                  className="mt-0.5 shrink-0 text-[var(--primary)]"
                />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">
                    Músculos trabalhados
                  </p>
                  <p className="text-sm capitalize">
                    <strong className="font-semibold">
                      {trMuscle(exercicio.target)}
                    </strong>{" "}
                    <span className="text-[var(--text-muted)]">(principal)</span>
                  </p>
                  {exercicio.secondaryMuscles?.length > 0 && (
                    <p className="mt-1 text-sm capitalize text-[var(--text-secondary)]">
                      {exercicio.secondaryMuscles.map(trMuscle).join(", ")}{" "}
                      <span className="text-[var(--text-muted)]">
                        (secundários)
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-muted)]">
                <PersonStanding
                  size={20}
                  className="mt-0.5 shrink-0 text-[var(--primary)]"
                />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">
                    Região do corpo
                  </p>
                  <p className="text-sm font-semibold capitalize">
                    {trBodyPart(exercicio.bodyPart)}
                  </p>
                </div>
              </div>
            </div>

            {/* <Button onClick={adicionarAFicha}>+ Adicionar à ficha</Button> */}
          </div>
        </section>

        {/* passo a passo */}
        <section className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
          <h2 className="text-xl font-semibold mb-5">Passo a passo</h2>
          <ol className="flex flex-col gap-5">
            {passos.map((passo, i) => {
              const { texto, dica } = splitDica(passo);
              return (
                <li key={i} className="flex gap-4">
                  <span className="grid place-items-center shrink-0 w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--text-on-primary)] text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-2 pt-1 max-w-[75ch]">
                    <p className="text-[15px] leading-relaxed text-[var(--text)]">
                      {texto}
                    </p>
                    {dica && (
                      <p className="px-3 py-2 rounded-lg text-sm leading-relaxed bg-[var(--bg-warning)] text-[var(--text-warning)]">
                        {dica}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default ExerciseDetail;
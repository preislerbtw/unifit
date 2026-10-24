import { useState, useEffect } from "react";

// Mostra as fotos de início e fim do movimento alternando, como uma animação.
function ExerciseDemo({ images, alt, intervalo = 900 }) {
  const [frame, setFrame] = useState(0);
  const [falhou, setFalhou] = useState(false);
  const chave = images.join("|");

  useEffect(() => {
    setFrame(0);
    setFalhou(false);
    if (images.length < 2) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % images.length), intervalo);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, intervalo]);

  if (!images.length || falhou) {
    return (
      <div className="w-full max-w-[420px] aspect-square rounded-xl bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)] text-base mx-auto max-md:max-w-full">
        Demonstração indisponível
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto max-md:max-w-full">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          className={`absolute inset-0 w-full h-full object-contain bg-[var(--bg-surface)] rounded-xl transition-opacity duration-[400ms] ease-in-out ${
            i === frame ? "opacity-100" : "opacity-0"
          }`}
          onError={() => setFalhou(true)}
        />
      ))}
    </div>
  );
}

export default ExerciseDemo;

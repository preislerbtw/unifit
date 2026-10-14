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
    return <div className="exercise-media-placeholder">Demonstração indisponível</div>;
  }

  return (
    <div className="exercise-demo">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          className={i === frame ? "is-active" : ""}
          onError={() => setFalhou(true)}
        />
      ))}
    </div>
  );
}

export default ExerciseDemo;
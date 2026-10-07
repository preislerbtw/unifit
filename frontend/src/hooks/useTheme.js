import { useState, useEffect } from "react";

function temaInicial() {
  try {
    const salvo = localStorage.getItem("tema");
    if (salvo === "dark" || salvo === "light") return salvo;
  } catch {
    // localStorage indisponível
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      localStorage.setItem("tema", tema);
    } catch {
      // ignora
    }
  }, [tema]);

  const alternarTema = () => {
    setTema((atual) => (atual === "dark" ? "dark" : "light"));
  };

  return { tema, alternarTema };
}
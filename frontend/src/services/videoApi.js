import { curatedVideos } from "../utils/exerciseVideos";

const KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// link de busca no YouTube (funciona sem chave de API)
export function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

// Procura o vídeo de um exercício, nesta ordem:
// 1) lista escolhida à mão (utils/exerciseVideos.js)
// 2) busca na YouTube Data API (se existir VITE_YOUTUBE_API_KEY), com cache
// 3) null -> a tela mostra um link para buscar no YouTube
export async function findExerciseVideo({ exerciseId, query }) {
  if (curatedVideos[exerciseId]) return curatedVideos[exerciseId];
  if (!KEY || !query) return null;

  const cacheKey = `yt:v1:${query.toLowerCase()}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch {
    // sem cache: segue
  }

  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      videoEmbeddable: "true",
      maxResults: "1",
      relevanceLanguage: "pt",
      regionCode: "BR",
      key: KEY,
    });
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    if (!res.ok) return null; // cota esgotada ou chave inválida
    const data = await res.json();
    const videoId = data.items?.[0]?.id?.videoId ?? null;

    if (videoId) {
      try {
        localStorage.setItem(cacheKey, videoId);
      } catch {
        // ignora
      }
    }
    return videoId;
  } catch {
    return null;
  }
}

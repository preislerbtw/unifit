export function getUsuario() {
  const usuario =
    localStorage.getItem("usuario_logado") || sessionStorage.getItem("usuario_logado");
  return usuario ? JSON.parse(usuario) : null;
}
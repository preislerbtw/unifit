// codigo publico de 4 digitos que o usuario compartilha para ser adicionado (ex.: "0427")
function gerarCodigo() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}

module.exports = { gerarCodigo };

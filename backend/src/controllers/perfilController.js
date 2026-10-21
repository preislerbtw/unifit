const perfilService = require("../services/perfilService");
async function atualizarMedidas(req, res) {
  const { idUsuario, peso, altura } = req.body;
  const resultado = await perfilService.atualizarMedidas( idUsuario, peso, altura,
  );
  res.json({ message: "dados salvos!", ...resultado });
}
module.exports = { atualizarMedidas };
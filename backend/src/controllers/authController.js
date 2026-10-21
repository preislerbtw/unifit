const authService = require("../services/authService");

async function cadastrar(req, res) {
    await authService.cadastrar(req.body);
    res.status(201).json({message: "usuario cadastrado com sucesso!"});
    // 201 - requisicao bem sucedida e novo recurso foi criado
} 
async function login(req, res) {
    const { matricula, senha } = req.body;
    const usuario = await authService.login(matricula, senha);
    res.json({message: "logado com sucesso!", usuario});
}   
module.exports = { cadastrar, login };
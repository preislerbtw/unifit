const { Router } = require("express");
const agendamento = require("../controllers/agendamentoController");

const router = Router();

router.get("/agendamentos", agendamento.listar);
// precisa vir antes de qualquer rota com :id
router.get("/agendamentos/ocupados", agendamento.ocupados);
router.post("/agendamentos", agendamento.criar);
router.patch("/agendamentos/:id/status", agendamento.atualizarStatus);

module.exports = router;
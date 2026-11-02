const db = require("../config/database");

const SELECT_FICHA = `
  SELECT
    f.idFicha_treino,
    f.usuario_idUsuario,
    f.nome,
    f.objetivo,
    f.criada_em,
    f.atualizada_em,
    f.criado_por_idUsuario,
    dono.nome AS dono_nome,
    dono.nivel_experiencia AS dono_nivel,
    criador.nome AS criador_nome,
    criador.perfil AS criador_perfil
  FROM ficha_treino f
  JOIN usuario dono ON dono.idUsuario = f.usuario_idUsuario
  LEFT JOIN usuario criador ON criador.idUsuario = f.criado_por_idUsuario`;

// junta os exercicios de cada ficha em ficha.exercicios
async function comExercicios(fichas) {
  if (fichas.length === 0) return fichas;

  const [linhas] = await db.query(
    `SELECT * FROM ficha_exercicio
     WHERE ficha_treino_idFicha_treino IN (?)
     ORDER BY ordem`,
    [fichas.map((f) => f.idFicha_treino)]
  );

  return fichas.map((f) => ({
    ...f,
    exercicios: linhas.filter((l) => l.ficha_treino_idFicha_treino === f.idFicha_treino),
  }));
}

async function listarDoDono(idDono) {
  const [fichas] = await db.query(
    `${SELECT_FICHA} WHERE f.usuario_idUsuario = ? ORDER BY f.atualizada_em DESC`,
    [idDono]
  );
  return comExercicios(fichas);
}

// fichas dos alunos que adicionaram o professor
async function listarDosAlunosDoProfessor(idProfessor) {
  const [fichas] = await db.query(
    `${SELECT_FICHA}
     JOIN professor_aluno pa ON pa.aluno_idUsuario = f.usuario_idUsuario
     WHERE pa.professor_idProfessor = ?
     ORDER BY f.atualizada_em DESC`,
    [idProfessor]
  );
  return comExercicios(fichas);
}

async function listarTodas() {
  const [fichas] = await db.query(`${SELECT_FICHA} ORDER BY f.atualizada_em DESC`);
  return comExercicios(fichas);
}

async function buscarPorId(idFicha) {
  const [fichas] = await db.query(`${SELECT_FICHA} WHERE f.idFicha_treino = ?`, [idFicha]);
  const [ficha] = await comExercicios(fichas);
  return ficha ?? null;
}

async function inserirExercicios(conexao, idFicha, exercicios) {
  if (exercicios.length === 0) return;

  await conexao.query(
    `INSERT INTO ficha_exercicio
     (ficha_treino_idFicha_treino, ordem, series, repeticoes, carga,
      exercicio_ref, exercicio_nome, parte_corpo, equipamento, dificuldade)
     VALUES ?`,
    [
      exercicios.map((e, i) => [
        idFicha,
        i + 1,
        e.series,
        e.repeticoes,
        e.carga,
        e.exercicioRef,
        e.nome,
        e.parteCorpo,
        e.equipamento,
        e.dificuldade,
      ]),
    ]
  );
}

// roda fn dentro de uma transacao e devolve o resultado dela
async function emTransacao(fn) {
  const conexao = await db.getConnection();
  try {
    await conexao.beginTransaction();
    const resultado = await fn(conexao);
    await conexao.commit();
    return resultado;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

async function criar({ idDono, idCriador, nome, objetivo, exercicios }) {
  return emTransacao(async (conexao) => {
    const [resultado] = await conexao.query(
      `INSERT INTO ficha_treino (usuario_idUsuario, criado_por_idUsuario, nome, objetivo)
       VALUES (?, ?, ?, ?)`,
      [idDono, idCriador, nome, objetivo]
    );
    await inserirExercicios(conexao, resultado.insertId, exercicios);
    return resultado.insertId;
  });
}

// troca nome, objetivo e a lista inteira de exercicios
async function atualizar(idFicha, { nome, objetivo, exercicios }) {
  await emTransacao(async (conexao) => {
    await conexao.query(
      "UPDATE ficha_treino SET nome = ?, objetivo = ?, atualizada_em = NOW() WHERE idFicha_treino = ?",
      [nome, objetivo, idFicha]
    );
    await conexao.query("DELETE FROM ficha_exercicio WHERE ficha_treino_idFicha_treino = ?", [idFicha]);
    await inserirExercicios(conexao, idFicha, exercicios);
  });
}

async function excluir(idFicha) {
  await emTransacao(async (conexao) => {
    await conexao.query("DELETE FROM ficha_exercicio WHERE ficha_treino_idFicha_treino = ?", [idFicha]);
    await conexao.query("DELETE FROM ficha_treino WHERE idFicha_treino = ?", [idFicha]);
  });
}

module.exports = {
  listarDoDono,
  listarDosAlunosDoProfessor,
  listarTodas,
  buscarPorId,
  criar,
  atualizar,
  excluir,
};

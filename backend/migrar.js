// atualiza um banco ja existente com o que foi adicionado no schema.sql depois.
// pode rodar mais de uma vez: node migrar.js
const db = require("./src/config/database");
const { gerarCodigo } = require("./src/utils/codigoUsuario");

async function temColuna(tabela, coluna) {
  const [linhas] = await db.query("SHOW COLUMNS FROM ?? LIKE ?", [tabela, coluna]);
  return linhas.length > 0;
}

(async () => {
  // codigo de 4 digitos em usuario
  if (!(await temColuna("usuario", "codigo"))) {
    await db.query(
      "ALTER TABLE usuario ADD COLUMN codigo CHAR(4) NULL, ADD UNIQUE INDEX codigo_UNIQUE (codigo)",
    );
    console.log("Coluna codigo criada.");
  }

  const [comCodigo] = await db.query("SELECT codigo FROM usuario WHERE codigo IS NOT NULL");
  const usados = new Set(comCodigo.map((u) => u.codigo));

  const [semCodigo] = await db.query("SELECT idUsuario FROM usuario WHERE codigo IS NULL");
  for (const u of semCodigo) {
    let codigo;
    do {
      codigo = gerarCodigo();
    } while (usados.has(codigo));
    usados.add(codigo);

    await db.query("UPDATE usuario SET codigo = ? WHERE idUsuario = ?", [codigo, u.idUsuario]);
  }
  console.log(`Códigos gerados: ${semCodigo.length}.`);

  // escolha do cadastro: com ou sem personal, e o aceite do termo de responsabilidade
  if (!(await temColuna("usuario", "quer_personal"))) {
    await db.query(`
      ALTER TABLE usuario
        ADD COLUMN quer_personal TINYINT(1) NOT NULL DEFAULT 1,
        ADD COLUMN aceitou_termos TINYINT(1) NOT NULL DEFAULT 0
    `);
    console.log("usuario: quer_personal e aceitou_termos criadas.");
  }

  // vinculo aluno <-> professor
  await db.query(`
    CREATE TABLE IF NOT EXISTS professor_aluno (
      professor_idProfessor INT NOT NULL,
      aluno_idUsuario INT NOT NULL,
      criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (professor_idProfessor, aluno_idUsuario),
      INDEX fk_professor_aluno_usuario1_idx (aluno_idUsuario),
      CONSTRAINT fk_professor_aluno_professor1
        FOREIGN KEY (professor_idProfessor) REFERENCES professor (idProfessor),
      CONSTRAINT fk_professor_aluno_usuario1
        FOREIGN KEY (aluno_idUsuario) REFERENCES usuario (idUsuario)
    ) ENGINE = InnoDB
  `);
  console.log("Tabela professor_aluno ok.");

  // fichas: quem criou, quando mudou e os dados do exercicio guardados na propria ficha
  if (!(await temColuna("ficha_treino", "criado_por_idUsuario"))) {
    await db.query(`
      ALTER TABLE ficha_treino
        ADD COLUMN criado_por_idUsuario INT NULL,
        ADD COLUMN atualizada_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        ADD INDEX fk_ficha_treino_criado_por_idx (criado_por_idUsuario),
        ADD CONSTRAINT fk_ficha_treino_criado_por
          FOREIGN KEY (criado_por_idUsuario) REFERENCES usuario (idUsuario)
    `);
    console.log("ficha_treino atualizada.");
  }

  if (!(await temColuna("ficha_exercicio", "exercicio_ref"))) {
    await db.query(`
      ALTER TABLE ficha_exercicio
        MODIFY exercicio_idExercicio INT NULL,
        MODIFY carga VARCHAR(20) NULL,
        ADD COLUMN exercicio_ref VARCHAR(100) NULL,
        ADD COLUMN exercicio_nome VARCHAR(150) NULL,
        ADD COLUMN parte_corpo VARCHAR(45) NULL,
        ADD COLUMN equipamento VARCHAR(45) NULL,
        ADD COLUMN dificuldade VARCHAR(45) NULL
    `);
    console.log("ficha_exercicio atualizada.");
  }

  // agendamento: quem cancelou ("aluno" ou "professor") e quando
  if (!(await temColuna("agendamento", "cancelado_por"))) {
    await db.query(`
      ALTER TABLE agendamento
        ADD COLUMN cancelado_por VARCHAR(20) NULL,
        ADD COLUMN cancelado_em DATETIME NULL
    `);
    console.log("agendamento atualizado.");
  }

  process.exit(0);
})();

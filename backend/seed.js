const db = require("./src/config/database");
const bcrypt = require("bcrypt");

const usuarios = [
  {
    nome: "Aluno Teste",
    email: "aluno@teste.com",
    senha: "aluno123",
    matricula: "2024001",
    perfil: "aluno",
    curso: "Educação Física",
  },
  {
    nome: "Professor Teste",
    email: "professor@teste.com",
    senha: "prof123",
    matricula: "9000001",
    perfil: "professor",
    curso: null,
  },
  {
    nome: "Administrador",
    email: "admin@teste.com",
    senha: "admin123",
    matricula: "9999999",
    perfil: "admin",
    curso: null,
  },
];

(async () => {
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.senha, 10);
    await db.query(
      `INSERT INTO usuario (nome, email, senha_hash, matricula, perfil, curso)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE senha_hash = VALUES(senha_hash), perfil = VALUES(perfil)`,
      [u.nome, u.email, hash, u.matricula, u.perfil, u.curso],
    );
  }

  // academia + vinculo do professor
  const [acad] = await db.query("SELECT idAcademia FROM academia LIMIT 1");
  let idAcademia = acad[0]?.idAcademia;
  if (!idAcademia) {
    const [r] = await db.query(
      "INSERT INTO academia (Nome, Endereco, telefone) VALUES ('UniFit','Campus','85999999999')",
    );
    idAcademia = r.insertId;
  }

  const [p] = await db.query(
    "SELECT idUsuario FROM usuario WHERE matricula = '9000001'",
  );
  const [jaTem] = await db.query(
    "SELECT 1 FROM professor WHERE usuario_idUsuario = ?",
    [p[0].idUsuario],
  );
  if (jaTem.length === 0) {
    await db.query(
      "INSERT INTO professor (academia_idAcademia, usuario_idUsuario, especialidade) VALUES (?, ?, 'Musculação')",
      [idAcademia, p[0].idUsuario],
    );
  }

  console.log("Usuários criados.");
  process.exit(0);
})();

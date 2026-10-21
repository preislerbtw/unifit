const db = require("../config/database");

async function buscarPorMatricula(matricula) {
    const [linhas] = await db.query("SELECT * FROM usuario WHERE matricula = ?", [matricula]);
    return linhas[0] ?? null;
}

async function criar(usuario) {
    await db.query(
        `
        INSERT INTO usuario
        (
          nome,
          email,
          senha_hash,
          data_nascimento,
          objetivo,
          nivel_experiencia,
          perfil,
          matricula,
          curso,
          altura,
          peso
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            usuario.nome,
            usuario.email,
            usuario.senha_hash,
            usuario.data_nascimento,
            usuario.objetivo,
            usuario.nivel_experiencia,
            "aluno",
            usuario.matricula,
            usuario.curso,
            usuario.altura,
            usuario.peso,
        ]
    );
}

async function atualizarMedidas(idUsuario, peso, altura) {
    const [resultado] = await db.query(
        `
        UPDATE usuario
        SET peso = ?, altura = ?
        WHERE idUsuario = ?
        `,
        [peso, altura, idUsuario]
    );
    return resultado.affectedRows;
}
module.exports = { buscarPorMatricula, criar, atualizarMedidas };

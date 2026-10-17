const http = require("http");
const db = require("./database");
const bcrypt = require("bcrypt");

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

// helpers

function enviarJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function lerBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (erro) {
        reject(erro);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // testar banco

  if (req.url === "/teste-banco") {
    try {
      const [rows] = await db.query("SELECT 1 + 1 AS resultado");
      enviarJSON(res, 200, rows);
    } catch (erro) {
      console.log(erro);
      enviarJSON(res, 500, {
        message: "Erro ao conectar no banco",
        erro: erro.message,
      });
    }
    return;
  }

  // cadastro

  if (req.method === "POST" && req.url === "/cadastro") {
    try {
      const dados = await lerBody(req);

      const {
        nome,
        email,
        senha,
        data_nascimento,
        objetivo,
        nivel_experiencia,
        matricula,
        curso,
        altura,
        peso,
      } = dados;

      // ignora qualquer "perfil" enviado pelo cliente
      const perfil = "aluno";

      const senha_hash = await bcrypt.hash(senha, 10);

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
          peso,
        ]
      );

      enviarJSON(res, 201, { message: "Usuario cadastrado com sucesso!" });
    } catch (erro) {
      console.log(erro);
      enviarJSON(res, 400, {
        message: "Erro ao cadastrar usuário",
        erro: erro.message,
      });
    }
    return;
  }

  // login

  if (req.method === "POST" && req.url === "/login") {
    try {
      const { matricula, senha } = await lerBody(req);

      const [usuario] = await db.query(
        `
        SELECT *
        FROM usuario
        WHERE matricula = ?
        `,
        [matricula]
      );

      if (usuario.length === 0) {
        enviarJSON(res, 401, { message: "Usuario ou Senha errados" });
        return;
      }

      const senhaCerta = await bcrypt.compare(senha, usuario[0].senha_hash);

      if (!senhaCerta) {
        enviarJSON(res, 401, { message: "Usuario ou Senha errados" });
        return;
      }

      const user = usuario[0];

      // se o usuario for professor, busca o id dele na tabela professor
      const [prof] = await db.query(
        `
        SELECT idProfessor
        FROM professor
        WHERE usuario_idUsuario = ?
        `,
        [user.idUsuario]
      );

      enviarJSON(res, 200, {
        message: "Logado com sucesso",
        usuario: {
          id: user.idUsuario,
          nome: user.nome,
          email: user.email,
          data_nascimento: user.data_nascimento,
          objetivo: user.objetivo,
          nivel_experiencia: user.nivel_experiencia,
          perfil: user.perfil,
          matricula: user.matricula,
          curso: user.curso,
          altura: user.altura,
          peso: user.peso,
          professorId: prof[0]?.idProfessor ?? null,
        },
      });
    } catch (erro) {
      console.log(erro);
      enviarJSON(res, 500, { message: "Erro" });
    }
    return;
  }

  // enviar mensagens

  if (req.method === "POST" && req.url === "/mensagem") {
    try {
      const dados = await lerBody(req);

      await db.query(
        `
        INSERT INTO chat_mensagem
        (
          remetente_id,
          destinatario_id,
          mensagem
        )
        VALUES (?, ?, ?)
        `,
        [dados.remetente_id, dados.destinatario_id, dados.mensagem]
      );

      enviarJSON(res, 201, { success: true });
    } catch (erro) {
      console.log(erro);
      enviarJSON(res, 500, { error: erro.message });
    }
    return;
  }

  // buscar mensagens

  if (req.method === "GET" && req.url.startsWith("/mensagens")) {
    try {
      const url = new URL(req.url, "http://localhost:3000");

      const user1 = url.searchParams.get("user1");
      const user2 = url.searchParams.get("user2");

      const [rows] = await db.query(
        `
        SELECT *
        FROM chat_mensagem
        WHERE
          (remetente_id = ? AND destinatario_id = ?)
          OR
          (remetente_id = ? AND destinatario_id = ?)
        ORDER BY criada_em ASC
        `,
        [user1, user2, user2, user1]
      );

      enviarJSON(res, 200, rows);
    } catch (erro) {
      console.log(erro);
      enviarJSON(res, 500, { error: erro.message });
    }
    return;
  }

  // listar conversas

  if (req.method === "GET" && req.url.startsWith("/conversas/")) {
    try {
      const userId = req.url.split("/")[2];

      const [rows] = await db.query(
        `
        SELECT DISTINCT
          CASE
            WHEN remetente_id = ?
            THEN destinatario_id
            ELSE remetente_id
          END AS id
        FROM chat_mensagem
        WHERE
          remetente_id = ?
          OR destinatario_id = ?
        `,
        [userId, userId, userId]
      );

      enviarJSON(res, 200, rows);
    } catch (erro) {
      console.log(erro);
      enviarJSON(res, 500, { error: erro.message });
    }
    return;
  }

  // rota padrao

  enviarJSON(res, 200, { message: "Servidor rodando!" });
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
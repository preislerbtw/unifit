const http = require("http");
const db = require("./database");
const bcrypt = require("bcrypt");

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // TESTE BANCO

  if (req.url === "/teste-banco") {
    const [rows] =
      await db.query(
        "SELECT 1 + 1 AS resultado"
      );

    res.writeHead(200, {
      "Content-Type":
        "application/json",
    });

    res.end(JSON.stringify(rows));
    return;
  }

  // CADASTRO

  if (
    req.method === "POST" &&
    req.url === "/cadastro"
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const dados =
          JSON.parse(body);

        const {
          nome,
          email,
          senha,
          data_nascimento,
          objetivo,
          nivel_experiencia,
          perfil,
          matricula,
          curso,
        } = dados;

        const senha_hash =
          await bcrypt.hash(
            senha,
            10
          );

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
            curso
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          ]
        );

        res.writeHead(201, {
          "Content-Type":
            "application/json",
        });

        res.end(
          JSON.stringify({
            message:
              "Usuario cadastrado com sucesso!",
          })
        );
      } catch (erro) {
        console.log(erro);

        res.writeHead(400, {
          "Content-Type":
            "application/json",
        });

        res.end(
          JSON.stringify({
            message:
              "Erro ao cadastrar usuário",
            erro: erro.message,
          })
        );
      }
    });

    return;
  }

  // LOGIN

  if (
    req.method === "POST" &&
    req.url === "/login"
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const dados =
          JSON.parse(body);

        const {
          matricula,
          senha,
        } = dados;

        const [usuario] =
          await db.query(
            `
            SELECT *
            FROM usuario
            WHERE matricula = ?
            `,
            [matricula]
          );

        if (
          usuario.length === 0
        ) {
          res.writeHead(401, {
            "Content-Type":
              "application/json",
          });

          res.end(
            JSON.stringify({
              message:
                "Usuario ou Senha errados",
            })
          );

          return;
        }

        const senhaCerta =
          await bcrypt.compare(
            senha,
            usuario[0].senha_hash
          );

        if (!senhaCerta) {
          res.writeHead(401, {
            "Content-Type":
              "application/json",
          });

          res.end(
            JSON.stringify({
              message:
                "Usuario ou Senha errados",
            })
          );

          return;
        }

        const user =
          usuario[0];

        res.writeHead(200, {
          "Content-Type":
            "application/json",
        });

        res.end(
          JSON.stringify({
            message:
              "Logado com sucesso",

            usuario: {
              id:
                user.idUsuario,
              nome: user.nome,
              email:
                user.email,
              data_nascimento:
                user.data_nascimento,
              objetivo:
                user.objetivo,
              nivel_experiencia:
                user.nivel_experiencia,
              perfil:
                user.perfil,
              matricula:
                user.matricula,
              curso:
                user.curso,
              altura:
                user.altura,
              peso:
                user.peso,
            },
          })
        );
      } catch (erro) {
        console.log(erro);

        res.writeHead(500, {
          "Content-Type":
            "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Erro",
          })
        );
      }
    });

    return;
  }

  // ENVIAR MENSAGEM

  if (
    req.method === "POST" &&
    req.url === "/mensagem"
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const dados =
          JSON.parse(body);

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
          [
            dados.remetente_id,
            dados.destinatario_id,
            dados.mensagem,
          ]
        );

        res.writeHead(201, {
          "Content-Type":
            "application/json",
        });

        res.end(
          JSON.stringify({
            success: true,
          })
        );
      } catch (erro) {
        console.log(erro);

        res.writeHead(500, {
          "Content-Type":
            "application/json",
        });

        res.end(
          JSON.stringify({
            error:
              erro.message,
          })
        );
      }
    });

    return;
  }

  // BUSCAR MENSAGENS

  if (
    req.method === "GET" &&
    req.url.startsWith(
      "/mensagens"
    )
  ) {
    try {
      const url =
        new URL(
          req.url,
          "http://localhost:3000"
        );

      const user1 =
        url.searchParams.get(
          "user1"
        );

      const user2 =
        url.searchParams.get(
          "user2"
        );

      const [rows] =
        await db.query(
          `
          SELECT *
          FROM chat_mensagem

          WHERE
          (
            remetente_id = ?
            AND destinatario_id = ?
          )

          OR

          (
            remetente_id = ?
            AND destinatario_id = ?
          )

          ORDER BY criada_em ASC
          `,
          [
            user1,
            user2,
            user2,
            user1,
          ]
        );

      res.writeHead(200, {
        "Content-Type":
          "application/json",
      });

      res.end(
        JSON.stringify(rows)
      );
    } catch (erro) {
      console.log(erro);

      res.writeHead(500, {
        "Content-Type":
          "application/json",
      });

      res.end(
        JSON.stringify({
          error:
            erro.message,
        })
      );
    }

    return;
  }

  // LISTAR CONVERSAS

if (
  req.method === "GET" &&
  req.url.startsWith("/conversas/")
) {

  try {

    const userId =
      req.url.split("/")[2];

    const [rows] =
      await db.query(
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
        [
          userId,
          userId,
          userId
        ]
      );

    res.writeHead(200, {
      "Content-Type":
        "application/json",
    });

    res.end(
      JSON.stringify(rows)
    );

  } catch (erro) {

    console.log(erro);

    res.writeHead(500, {
      "Content-Type":
        "application/json",
    });

    res.end(
      JSON.stringify({
        error:
          erro.message,
      })
    );

  }

  return;
}

// ROTA PADRÃO

res.writeHead(200, {
  "Content-Type":
    "application/json",
});

res.end(
  JSON.stringify({
    message:
      "Servidor rodando!",
  })
);
});

server.listen(
  3000,
  () => {
    console.log(
      "Servidor rodando na porta 3000"
    );
  }
);
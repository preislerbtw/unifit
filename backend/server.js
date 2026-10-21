const app = require("./src/app");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`servidor rodando na porta ${PORT}`);
})
// const http = require("http");
// const db = require("./database");
// const bcrypt = require("bcrypt");
// const { enviarJSON } = require("./src/http/resposta");
// const { lerBody } = require("./src/http/lerBody");
// const usuarioRepository = require("./src/repositories/usuarioRepository");

// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_NAME:", process.env.DB_NAME);

// const server = http.createServer(async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   if (req.method === "OPTIONS") {
//     res.writeHead(204);
//     res.end();
//     return;
//   }

//   // TESTE BANCO

//   if (req.url === "/teste-banco") {
//     try {
//       const [rows] = await db.query("SELECT 1 + 1 AS resultado");
//       enviarJSON(res, 200, rows);
//     } catch (erro) {
//       console.log(erro);
//       enviarJSON(res, 500, {
//         message: "Erro ao conectar no banco",
//         erro: erro.message,
//       });
//     }
//     return;
//   }

//   // CADASTRO
//   // Cadastro público: sempre cria ALUNO. Professor e admin são criados
//   // direto no banco (ex.: backend/seed.js), nunca por essa rota.

//   if (req.method === "POST" && req.url === "/cadastro") {
//     try {
//       const dados = await lerBody(req);

//       const {
//         nome,
//         email,
//         senha,
//         data_nascimento,
//         objetivo,
//         nivel_experiencia,
//         matricula,
//         curso,
//         altura,
//         peso,
//       } = dados;

//       // ignora qualquer "perfil" enviado pelo cliente
//       const perfil = "aluno";

//       const senha_hash = await bcrypt.hash(senha, 10);

//       await usuarioRepository.criar({
//         nome,
//         email,
//         senha_hash,
//         data_nascimento,
//         objetivo,
//         nivel_experiencia,
//         matricula,
//         curso,
//         altura,
//         peso,
//       });

//       enviarJSON(res, 201, { message: "Usuario cadastrado com sucesso!" });
//     } catch (erro) {
//       console.log(erro);

//       // matrícula ou e-mail já existem (índices únicos da tabela usuario)
//       if (erro.code === "ER_DUP_ENTRY") {
//         enviarJSON(res, 409, { message: "Matrícula ou e-mail já cadastrado." });
//         return;
//       }

//       enviarJSON(res, 400, {
//         message: "Erro ao cadastrar usuário",
//         erro: erro.message,
//       });
//     }
//     return;
//   }

//   // LOGIN
//   // Devolve o perfil (aluno | professor | admin) para o front decidir
//   // quais telas liberar, e o professorId quando o usuário é professor.

//   if (req.method === "POST" && req.url === "/login") {
//     try {
//       const { matricula, senha } = await lerBody(req);

//       const user = await usuarioRepository.buscarPorMatricula(matricula);

//       if (!user) {
//         enviarJSON(res, 401, { message: "Usuario ou Senha errados" });
//         return;
//       }

//       const senhaCerta = await bcrypt.compare(senha, user.senha_hash);

//       if (!senhaCerta) {
//         enviarJSON(res, 401, { message: "Usuario ou Senha errados" });
//         return;
//       }


//       // se o usuário for professor, busca o id dele na tabela professor
//       const [prof] = await db.query(
//         `
//         SELECT idProfessor
//         FROM professor
//         WHERE usuario_idUsuario = ?
//         `,
//         [user.idUsuario]
//       );

//       enviarJSON(res, 200, {
//         message: "Logado com sucesso",
//         usuario: {
//           id: user.idUsuario,
//           nome: user.nome,
//           email: user.email,
//           data_nascimento: user.data_nascimento,
//           objetivo: user.objetivo,
//           nivel_experiencia: user.nivel_experiencia,
//           perfil: user.perfil,
//           matricula: user.matricula,
//           curso: user.curso,
//           altura: user.altura,
//           peso: user.peso,
//           professorId: prof[0]?.idProfessor ?? null,
//         },
//       });
//     } catch (erro) {
//       console.log(erro);
//       enviarJSON(res, 500, { message: "Erro" });
//     }
//     return;
//   }

//   // ATUALIZAR PESO E ALTURA (tela de perfil)
//   // peso em kg (ex.: 72.5) e altura em metros (ex.: 1.75)

//   if (req.method === "POST" && req.url === "/perfil/medidas") {
//     try {
//       const { idUsuario, peso, altura } = await lerBody(req);

//       const p = Number(peso);
//       const a = Number(altura);

//       if (!idUsuario) {
//         enviarJSON(res, 400, { message: "Usuário não informado." });
//         return;
//       }
//       if (!Number.isFinite(p) || p < 20 || p > 300) {
//         enviarJSON(res, 400, { message: "Peso inválido (use entre 20 e 300 kg)." });
//         return;
//       }
//       if (!Number.isFinite(a) || a < 1 || a > 2.5) {
//         enviarJSON(res, 400, { message: "Altura inválida (use entre 1,00 e 2,50 m)." });
//         return;
//       }
//       const linhasAlteradas = await usuarioRepository.atualizarMedidas(idUsuario, p, a);

//       if (linhasAlteradas === 0) {
//         enviarJSON(res, 404, { message: "Usuário não encontrado." });
//         return;
//       }

//       enviarJSON(res, 200, { message: "Dados salvos!", peso: p, altura: a });
//     } catch (erro) {
//       console.log(erro);
//       enviarJSON(res, 500, { message: "Erro ao salvar peso e altura." });
//     }
//     return;
//   }

//   // ENVIAR MENSAGEM

//   if (req.method === "POST" && req.url === "/mensagem") {
//     try {
//       const dados = await lerBody(req);

//       await db.query(
//         `
//         INSERT INTO chat_mensagem
//         (
//           remetente_id,
//           destinatario_id,
//           mensagem
//         )
//         VALUES (?, ?, ?)
//         `,
//         [dados.remetente_id, dados.destinatario_id, dados.mensagem]
//       );

//       enviarJSON(res, 201, { success: true });
//     } catch (erro) {
//       console.log(erro);
//       enviarJSON(res, 500, { error: erro.message });
//     }
//     return;
//   }

//   // BUSCAR MENSAGENS

//   if (req.method === "GET" && req.url.startsWith("/mensagens")) {
//     try {
//       const url = new URL(req.url, "http://localhost:3000");

//       const user1 = url.searchParams.get("user1");
//       const user2 = url.searchParams.get("user2");

//       const [rows] = await db.query(
//         `
//         SELECT *
//         FROM chat_mensagem
//         WHERE
//           (remetente_id = ? AND destinatario_id = ?)
//           OR
//           (remetente_id = ? AND destinatario_id = ?)
//         ORDER BY criada_em ASC
//         `,
//         [user1, user2, user2, user1]
//       );

//       enviarJSON(res, 200, rows);
//     } catch (erro) {
//       console.log(erro);
//       enviarJSON(res, 500, { error: erro.message });
//     }
//     return;
//   }

//   // LISTAR CONVERSAS

//   if (req.method === "GET" && req.url.startsWith("/conversas/")) {
//     try {
//       const userId = req.url.split("/")[2];

//       const [rows] = await db.query(
//         `
//         SELECT DISTINCT
//           CASE
//             WHEN remetente_id = ?
//             THEN destinatario_id
//             ELSE remetente_id
//           END AS id
//         FROM chat_mensagem
//         WHERE
//           remetente_id = ?
//           OR destinatario_id = ?
//         `,
//         [userId, userId, userId]
//       );

//       enviarJSON(res, 200, rows);
//     } catch (erro) {
//       console.log(erro);
//       enviarJSON(res, 500, { error: erro.message });
//     }
//     return;
//   }

//   // ROTA PADRÃO

//   if (req.url === "/") {
//     enviarJSON(res, 200, { message: "Servidor rodando!" });
//     return;
//   }

//   // qualquer rota que não existe
//   enviarJSON(res, 404, { message: "Rota não encontrada." });
// });

// server.listen(3000, () => {
//   console.log("Servidor rodando na porta 3000");
// });
const http = require('http');
const db = require('./database');
const bcrypt = require('bcrypt');

const server = http.createServer(async (req, res) => {
  if (req.url === '/teste-banco') {
    const [rows] = await db.query('SELECT 1 + 1 AS resultado');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows));
    return;
  }

  if (req.method === 'POST' && req.url === '/cadastro') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const dados = JSON.parse(body);
        const { nome, email, senha, data_nascimento, objetivo, nivel_experiencia, perfil } = dados;

        const senha_hash = await bcrypt.hash(senha, 10);

        await db.query(
          'INSERT INTO usuario (nome, email, senha_hash, data_nascimento, objetivo, nivel_experiencia, perfil) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [nome, email, senha_hash, data_nascimento, objetivo, nivel_experiencia, perfil]
        );

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Usuario cadastrado com sucesso!' }));
      } catch (erro) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Erro ao cadastrar usuário', erro: erro.message }));
      }
    });
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Servidor rodando!' }));
});

server.listen(3000, () => console.log('Servidor rodando na porta 3000'));
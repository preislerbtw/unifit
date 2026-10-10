const http = require('http');
const db = require('./database');
const bcrypt = require('bcrypt');

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

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
        const { nome, email, senha, data_nascimento, objetivo, nivel_experiencia, perfil, matricula, curso } = dados;

        const senha_hash = await bcrypt.hash(senha, 10);

        await db.query(
          'INSERT INTO usuario (nome, email, senha_hash, data_nascimento, objetivo, nivel_experiencia, perfil, matricula, curso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [nome, email, senha_hash, data_nascimento, objetivo, nivel_experiencia, perfil, matricula, curso]
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

  if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try{
        const dados = JSON.parse(body);
        const { matricula, senha } = dados;

        const [usuario] = await db.query(
          'Select * from usuario where matricula = ?',
          [matricula]
        );

        if (usuario.length === 0){
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Usuario ou Senha errados'}));
          return;
        } 

        const senhaCerta = await bcrypt.compare(senha, usuario[0].senha_hash);

        if (!senhaCerta){
           res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Usuario ou Senha errados'}));
           return;
        }
        const user = usuario[0];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: 'Logado com sucesso',
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
            peso: user.peso
  }
}));

      } catch (erro){
        res.writeHead(500, { 'Content-Type': 'application/json' });
        console.log(erro)
        res.end(JSON.stringify({ message: 'Erro'}));
      }
    })
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Servidor rodando!' }));
});

server.listen(3000, () => console.log('Servidor rodando na porta 3000'));
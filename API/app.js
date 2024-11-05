const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'fteck*',  // Substitua pelo seu password do MySQL
  database: 'permissoes'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL.');
  }
});

// Middleware para analisar JSON
app.use(express.json());

// 1º Endpoint: Busca usuário e senha no banco de dados e retorna
app.get('/api/users', (req, res) => {
  const { usuario, senha } = req.query;
  db.query(
    'SELECT * FROM users WHERE usuario = ? AND senha = ?',
    [usuario, senha],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao buscar usuário e senha.' });
      } else {
        res.json(results);
      }
    }
  );
});

// 2º Endpoint: Busca todos os dados da tabela colaborador
app.get('/api/colaboradores', (req, res) => {
  db.query('SELECT * FROM colaborador', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar colaboradores.' });
    } else {
      res.json(results);
    }
  });
});

// 3º Endpoint: Busca todos os dados da tabela empresa
app.get('/api/empresas', (req, res) => {
  db.query('SELECT * FROM empresa', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar empresas.' });
    } else {
      res.json(results);
    }
  });
});

// 4º Endpoint: Cadastra nova empresa
app.post('/api/empresas', (req, res) => {
  const { nome } = req.body;
  db.query('INSERT INTO empresa (nome) VALUES (?)', [nome], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao cadastrar empresa.' });
    } else {
      res.json({ message: 'Empresa cadastrada com sucesso!', id: result.insertId });
    }
  });
});

// 5º Endpoint: Cadastra novo colaborador
app.post('/api/colaboradores', (req, res) => {
  const { nome, ocupacao, empresa_id } = req.body;
  db.query(
    'INSERT INTO colaborador (nome, ocupacao, empresa_id) VALUES (?, ?, ?)',
    [nome, ocupacao, empresa_id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao cadastrar colaborador.' });
      } else {
        res.json({ message: 'Colaborador cadastrado com sucesso!', id: result.insertId });
      }
    }
  );
});

// 6º Endpoint: Cadastra novo usuário
app.post('/api/users', (req, res) => {
  const { usuario, senha } = req.body;
  db.query(
    'INSERT INTO users (usuario, senha) VALUES (?, ?)',
    [usuario, senha],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
      } else {
        res.json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
      }
    }
  );
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

const secretKey = 'fkdz#29'; 

app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'fteck*', 
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

// 1º Endpoint: Login (Gera o token JWT)
app.get('/api/login', (req, res) => {
  const { usuario, senha } = req.query;
  
  db.query(
    'SELECT * FROM users WHERE usuario = ? AND senha = ?',
    [usuario, senha],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar usuário e senha.' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Usuário ou senha incorretos' });
      }

      // Usuário encontrado, gerando o token JWT
      const user = results[0];

      // Payload do token (informações do usuário)
      const payload = {
        id: user.id,
        usuario: user.usuario
      };

      // Geração do token com uma expiração de 1 hora
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

      // Envia o token na resposta
      res.json({ token });
    }
  );
});
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido.' });
  }

  // Remove o "Bearer " do início do token
  const tokenWithoutBearer = token.replace('Bearer ', '');

  jwt.verify(tokenWithoutBearer, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    }

    // Armazenar informações decodificadas do token (pode ser útil)
    req.user = decoded;
    next();
  });
}

// 2º Endpoint: Busca todos os dados de colaborador com o nome da empresa
app.get('/api/colaboradores-completo', (req, res) => {
  const { empresa, colaborador } = req.query;
  
  let query = 'SELECT c.id, c.nome, c.ocupacao, e.nome AS empresa ' +
              'FROM colaborador c ' +
              'JOIN empresa e ON c.empresa_id = e.id ';

  let queryParams = [];

  if (colaborador) {
    query += 'WHERE c.nome LIKE ? ';
    queryParams.push(`%${colaborador}%`);
  }

  if (empresa) {
    if (queryParams.length > 0) {
      query += 'AND e.nome LIKE ?';
    } else {
      query += 'WHERE e.nome LIKE ?';
    }
    queryParams.push(`%${empresa}%`);
  }

  // Adicionando a ordenação por ID
  query += 'ORDER BY c.id'; // Ordena pela coluna 'id'

  db.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar colaboradores.' });
    } else {
      res.json(results);
    }
  });
});

// 3º Endpoint: Cadastra nova empresa
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

// 4º Endpoint: Cadastra novo colaborador
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

// 5º Edita o cadastro do colaborador
app.put('/api/colaboradores/:id', (req, res) => {
  const { id } = req.params;  // O ID do colaborador é passado como parâmetro
  const { nome, ocupacao, empresa_id } = req.body;  // Dados do colaborador a serem atualizados

  db.query(
    'UPDATE colaborador SET nome = ?, ocupacao = ?, empresa_id = ? WHERE id = ?',
    [nome, ocupacao, empresa_id, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao atualizar colaborador.' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Colaborador não encontrado.' });
      } else {
        res.json({ message: 'Colaborador atualizado com sucesso!' });
      }
    }
  );
});

// 6º Endpoint: Deleta colaborador por ID
app.delete('/api/deletarColaborador/:id', (req, res) => {
  const { id } = req.params; // Obtém o ID da URL
  db.query('DELETE FROM colaborador WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir colaborador.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Colaborador não encontrado.' });
    }

    res.json({ message: 'Colaborador excluído com sucesso!' });
  });
});

// 5º Endpoint: Busca todos os dados da tabela empresa
app.post('/api/colaboradores', (req, res) => {
  const { nome, ocupacao, empresa_id } = req.body.colaborador;

  // Verificar se a empresa existe
  db.query('SELECT * FROM empresa WHERE id = ?', [empresa_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar empresa.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }

    // Se a empresa existir, continuar com a inserção do colaborador
    db.query('INSERT INTO colaborador (nome, ocupacao, empresa_id) VALUES (?, ?, ?)', [nome, ocupacao, empresa_id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao cadastrar colaborador.' });
      }

      res.json({ message: 'Colaborador cadastrado com sucesso!', id: result.insertId });
    });
  });
});

// 7º Endpoint: Busca empresas pelo nome
app.get('/api/empresas', (req, res) => {
  const { nome } = req.query;

  let query = 'SELECT * FROM empresa';
  let queryParams = [];

  if (nome) {
    query += ' WHERE nome LIKE ?';
    queryParams.push(`%${nome}%`);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar empresas.' });
    } else {
      res.json(results);
    }
  });
});


// 4º Endpoint: Busca colaborador por ID
app.get('/api/colaboradores/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM colaborador WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar colaborador.' });
    } else {
      if (result.length === 0) {
        return res.status(404).json({ error: 'Colaborador não encontrado.' });
      }
      res.json(result[0]);  // Retorna o colaborador encontrado
    }
  });
});


// 3º Endpoint: Busca todos os dados da tabela colaborador
app.get('/api/colaboradores', (req, res) => {
  db.query('SELECT * FROM colaborador', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar colaboradores.' });
    } else {
      res.json(results);
    }
  });
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


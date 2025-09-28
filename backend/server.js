// Backend básico para votos de avaliação do portfólio
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Inicializa banco SQLite
const db = new sqlite3.Database('./votos.db', (err) => {
  if (err) throw err;
  db.run('CREATE TABLE IF NOT EXISTS votos (id INTEGER PRIMARY KEY AUTOINCREMENT, nota INTEGER NOT NULL)', (err) => {
    if (err) throw err;
  });
});

// Rota para registrar voto
app.post('/api/votar', (req, res) => {
  const { nota } = req.body;
  if (!nota || nota < 1 || nota > 5) return res.status(400).json({ error: 'Nota inválida' });
  db.run('INSERT INTO votos (nota) VALUES (?)', [nota], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao registrar voto' });
    res.json({ success: true });
  });
});

// Rota para buscar média e total de votos
app.get('/api/avaliacao', (req, res) => {
  db.get('SELECT COUNT(*) as total, AVG(nota) as media FROM votos', (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar dados' });
    res.json({ total: row.total, media: row.media || 0 });
  });
});

app.listen(PORT, () => {
  console.log(`Backend de avaliação rodando em http://localhost:${PORT}`);
});

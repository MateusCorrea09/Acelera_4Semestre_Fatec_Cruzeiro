import express from 'express';
import db from './date/db.js';

const app = express();

app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        erro: err.message
      });
    }

    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
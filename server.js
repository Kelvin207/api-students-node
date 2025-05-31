const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 8001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET todos los estudiantes
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET un estudiante
app.get('/student/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Estudiante no encontrado' });
    res.json(row);
  });
});

// POST nuevo estudiante
app.post('/students', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  db.run(
    'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)',
    [firstname, lastname, gender, age],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PUT actualizar estudiante
app.put('/student/:id', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  db.run(
    'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?',
    [firstname, lastname, gender, age, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE estudiante
app.delete('/student/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});

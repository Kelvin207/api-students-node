const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 8001;

// ✅ Middlewares para aceptar JSON y form-data (x-www-form-urlencoded)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 GET todos los estudiantes
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🔹 GET un estudiante por ID
app.get('/student/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Estudiante no encontrado' });
    res.json(row);
  });
});

// 🔹 POST nuevo estudiante (acepta JSON o form-data)
app.post('/students', (req, res) => {
  const { firstname, lastname, gender, age } = req.body || {};

  if (!firstname || !lastname || !gender || !age) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  db.run(
    'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)',
    [firstname, lastname, gender, age],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// 🔹 PUT actualizar estudiante
app.put('/student/:id', (req, res) => {
  const { firstname, lastname, gender, age } = req.body || {};

  if (!firstname || !lastname || !gender || !age) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  db.run(
    'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?',
    [firstname, lastname, gender, age, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// 🔹 DELETE estudiante
app.delete('/student/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});

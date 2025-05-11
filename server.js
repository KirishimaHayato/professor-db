const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

const db = new sqlite3.Database('database.db');

// 添加教授信息
app.post('/api/professors', (req, res) => {
  const { university, faculty, professor_name, lab_name, title, keywords, evaluation, student_contact } = req.body;

  const stmt = db.prepare(`
    INSERT INTO professors (university, faculty, professor_name, lab_name, title, keywords, evaluation, student_contact)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run([university, faculty, professor_name, lab_name, title, keywords, evaluation, student_contact], function (err) {
    if (err) return res.status(500).send(err);
    res.json({ id: this.lastID });
  });
});

// 查询教授（支持关键词搜索）
app.get('/api/search', (req, res) => {
  const q = `%${req.query.q || ''}%`;
  db.all(`
    SELECT * FROM professors
    WHERE university LIKE ? OR faculty LIKE ? OR professor_name LIKE ?
      OR lab_name LIKE ? OR title LIKE ? OR keywords LIKE ?
      OR evaluation LIKE ? OR student_contact LIKE ?
  `, [q, q, q, q, q, q, q, q], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// 查询某学校或研究科下的所有教授
app.get('/api/group', (req, res) => {
  const { university, faculty } = req.query;
  db.all(`
    SELECT * FROM professors
    WHERE university = ? AND faculty = ?
    ORDER BY lab_name
  `, [university, faculty], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
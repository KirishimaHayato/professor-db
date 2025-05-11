const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS professors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      university TEXT,
      faculty TEXT,
      professor_name TEXT,
      lab_name TEXT,
      title TEXT,
      keywords TEXT,
      evaluation TEXT,
      student_contact TEXT
    )
  `);
});

db.close();
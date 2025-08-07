const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// connect/create database in the same folder
const dbPath = path.join(__dirname, 'shop.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error(err);
  console.log('Connected to SQLite database:', dbPath);
});

// initialise table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS customers (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            idNumber    TEXT    UNIQUE,
            phoneNumber TEXT    UNIQUE,
            service     TEXT    CHECK(service IN ('Deposit','Withdraw','Shop')),
            date        TEXT,
            time        TEXT
          );`);
});

// ---------- API ROUTES ----------

// POST /api/customers
app.post('/api/customers', (req, res) => {
  const { name, idNumber, phoneNumber, service } = req.body;

  // very light server-side validation
  if (!name || !idNumber || !phoneNumber || !service)
    return res.status(400).json({ error: 'All fields required' });
  if (phoneNumber.length !== 10)
    return res.status(400).json({ error: 'Phone must be 10 digits' });
  if (idNumber.length > 9 || isNaN(idNumber))
    return res.status(400).json({ error: 'ID must be ≤9 digits' });

  const stmt = db.prepare(`INSERT INTO customers
      (name, idNumber, phoneNumber, service, date, time)
      VALUES (?, ?, ?, ?, date('now'), time('now'))`);

  stmt.run([name, idNumber, phoneNumber, service], function (err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ error: 'Phone or ID already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

// GET /api/customers
app.get('/api/customers', (_req, res) => {
  db.all('SELECT * FROM customers ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// DELETE /api/customers/:id
app.delete('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM customers WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ success: true });
  });
});

// graceful shutdown (optional)
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error(err);
    console.log('\nDatabase closed. Goodbye!');
    process.exit(0);
  });
});

app.listen(PORT, () =>
  console.log(`SQLite API listening on http://localhost:${PORT}`)
);
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/')

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 8);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], function (err) {
    if (err) return res.status(400).json({ error: 'User already exists' });
    res.json({ success: true });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user) return res.status(400).json({ error: 'Invalid login' });
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid login' });
    
    res.json({ success: true, username: user.username });
  });
});

app.post('/violations', (req, res) => {
  console.log('Request body:', req.body);
  const { username, description, datetime, latitude, longitude, photo } = req.body;

  if (!username || !description || !datetime || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    db.run(
      'INSERT INTO violations (user_id, description, datetime, latitude, longitude, photo) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, description, datetime, latitude, longitude, photo],
      function (err) {
        if (err) {
          console.error('DB insert error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, id: this.lastID });
      }
    );
  });
});

app.get('/violations', (req, res) => {
  const query = `
    SELECT v.id, v.description, v.datetime, v.latitude, v.longitude, v.photo, u.username
    FROM violations v
    JOIN users u ON v.user_id = u.id
    ORDER BY v.datetime DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('DB select error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let favorites = [];

app.get('/api/favorites', (req, res) => {
  res.json(favorites);
});

app.post('/api/favorites', (req, res) => {
  const { name } = req.body;
  if (name) {
    favorites.push(name);
    res.status(201).json({ message: 'Favorite added', favorites });
  } else {
    res.status(400).json({ error: 'Name is required' });
  }
});

app.delete('/api/favorites/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (!isNaN(index) && index >= 0 && index < favorites.length) {
    favorites.splice(index, 1);
    res.json({ message: 'Favorite deleted', favorites });
  } else {
    res.status(400).json({ error: 'Invalid index' });
  }
});
app.put('/api/favorites/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { name } = req.body;
  if (!isNaN(index) && index >= 0 && index < favorites.length && name) {
    favorites[index] = name;
    res.json({ message: 'Favorite updated', favorites });
  } else {
    res.status(400).json({ error: 'Invalid request' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
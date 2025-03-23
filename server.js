const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../public/login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '../public/signup.html')));
app.get('/settings', (req, res) => res.sendFile(path.join(__dirname, '../public/settings.html')));
app.get('/calendar', (req, res) => res.sendFile(path.join(__dirname, '../public/calendar.html')));

// (Optional) API routes if you want dynamic backend later

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

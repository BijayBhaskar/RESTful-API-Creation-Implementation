const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Load users data from JSON file
function loadUsers() {
  const data = fs.readFileSync('./users.json', 'utf-8');
  return JSON.parse(data);
}

// Save users data to JSON file
function saveUsers(users) {
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
}

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the RESTful API server!');
});

// Get all users
app.get('/users', (req, res) => {
  const users = loadUsers();
  res.status(200).json(users);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.status(200).json(user);
});

// Create a new user
app.post('/users', (req, res) => {
  const users = loadUsers();

  const { name, username, password, role } = req.body;
  if (!name || !username || !password) {
    return res.status(400).send("Name, username, and password are required");
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    username,
    password,
    role: role || 'user'
  };

  users.push(newUser);
  saveUsers(users);
  res.status(201).json(newUser);
});

// Update an existing user
app.put('/users/:id', (req, res) => {
  const users = loadUsers();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");

  const { name, username, password, role } = req.body;

  user.name = name || user.name;
  user.username = username || user.username;
  user.password = password || user.password;
  user.role = role || user.role;

  saveUsers(users);
  res.status(200).json(user);
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  let users = loadUsers();
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send("User not found");

  users.splice(userIndex, 1);
  saveUsers(users);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


// RESTful-API-Creation-Implementation
// This project features a RESTful API built with Node.js and Express.js to perform CRUD operations on user data stored in JSON format. It demonstrates the fundamentals of REST architecture and backend development using JavaScript.
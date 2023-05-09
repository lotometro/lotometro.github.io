const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const qs = require('querystring');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const apiLocalAutenticar = 'http://localhost:9090/api/users/authenticate';

// Rotas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await axios.post('http://localhost:9090/api/users/authenticate', {
      username,
      password,
    });

    console.log(response.data);

    if (response.status === 200) {
      res.redirect(`/dashboard/${username}`);
    } else {
      res.status(401).send('Usuário ou senha inválidos!');
      //res.redirect(`/dashboard/${username}`);
    }
  } catch (error) {
    res.status(401).send('Usuário ou senha inválidos!');
    //res.redirect(`/dashboard/${username}`);
  }
});

app.get('/dashboard/:username', (req, res) => {
  const username = req.params.username;
  res.sendFile(__dirname + '/dashboard.html');
});

/*
app.get('/dashboard', (req, res) => {
  // Aqui você deve implementar a lógica para exibir o dashboard apenas para usuários autenticados
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + '/dashboard.html');
  } else {
    res.redirect('/');
  }
});
*/

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor Lotômetro rodando em http://localhost:${port}`);
});

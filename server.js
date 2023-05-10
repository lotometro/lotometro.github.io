const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const qs = require('querystring');
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dotenv = require('dotenv');

const config = JSON.parse(fs.readFileSync('./config.json'));

dotenv.config(); // Carrega as variáveis de ambiente

process.env.JWT_SECRET = config.jwt_secret;
process.env.ACCESS_TOKEN = config.access_token;

// Use as variáveis de ambiente carregadas
console.log(process.env.JWT_SECRET);
console.log(process.env.ACCESS_TOKEN);


const apiLocalAutenticar = 'http://localhost:9090/api/users/authenticate';

// Rotas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/dados', (req, res) => {
  
  
  
  const dados = {
    nome: 'João',
    idade: 30,
    cidade: 'São Paulo'
  };
  res.json(dados);
});

app.get('/dadosCamera', (req, res) => {

  const options = {
    method: 'GET',
    url: 'https://lotometroapi.azurewebsites.net/api/camera/getLastByIdLocationAndIdCamera/1/1',
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    }
  };

  axios(options)
  .then(response => {
    console.log(response.data);
    res.json(response.data);
  })
  .catch(error => {
    console.error(error);
  });
  
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await axios.post("https://lotometroapi.azurewebsites.net/api/users/authenticate", {
      username,
      password,
    })
    .then(response => {
      
      const token = response.data.token;
      console.log(token); // imprime o token JWT recebido na resposta JSON
      const config = JSON.parse(fs.readFileSync('./config.json'));
      config.access_token = token;
      fs.writeFileSync('./config.json', JSON.stringify(config));
      process.env.ACCESS_TOKEN = token;
  
      if (response.status === 200) {
        
        res.redirect(`/dashboard/${username}`);
      } else {
        res.status(401).send('Usuário ou senha inválidos!');
        //res.redirect(`/dashboard/${username}`);
      }
    })
    .catch(error => {
      console.error(error);
    });

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

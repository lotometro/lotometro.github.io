const request = require('request');

const username = 'seu_username';
const password = 'sua_senha';

const options = {
  url: 'http://localhost:9090/api/users/authenticate',
  method: 'GET',
  headers: {
    'User-Agent': 'request',
    'Content-Type': 'application/json'
  },
  json: {
    username: 'lotometro',
    password: '1234'
  }
};

request(options, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    console.log(body);
  } else {
    console.error('Ocorreu um erro ao realizar a requisição:', error);
  }
});


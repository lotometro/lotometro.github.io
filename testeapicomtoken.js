const axios = require('axios');
let token = '';

axios.post('https://lotometroapi.azurewebsites.net/api/users/authenticate', {
  username: 'lotometro',
  password: '1234'
})
.then(response => {
  token = response.data.token;
  console.log(token); // imprime o token JWT recebido na resposta JSON
})
.catch(error => {
  console.error(error);
});

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));

config.access_token = token;

fs.writeFileSync('./config.json', JSON.stringify(config));

process.env.ACCESS_TOKEN = token;

console.log(process.env.ACCESS_TOKEN);
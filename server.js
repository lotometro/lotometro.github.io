const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Configuração do Passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Aqui você deve implementar a lógica para verificar se o usuário e senha estão corretos
    //if (username === 'usuario' && bcrypt.compareSync(password, hashDaSenha)) {
    if (username === 'lotometro' && password === '1234') {
      return done(null, { username: username });
    } else {
      return done(null, false, { message: 'Username ou senha inválidos.' });
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  done(null, { username: username });
});

// Configuração do Express
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'lotometro_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/telaLogin', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/telaInicial', (req, res) => {
  res.sendFile(__dirname + '/telaInicial.html');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/',
  failureFlash: true
}));

app.get('/dashboard', (req, res) => {
  // Aqui você deve implementar a lógica para exibir o dashboard apenas para usuários autenticados
  if (req.isAuthenticated()) {
    res.send('Dashboard do Lotômetro');
  } else {
    res.redirect('/');
  }
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor Lotômetro rodando em http://localhost:${port}`);
});

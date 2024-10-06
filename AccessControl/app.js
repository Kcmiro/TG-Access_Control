//Módulos Internos
const path = require('path');

//Módulos Externos
const express = require('express');
const session = require('express-session');

//Modulos do Projeto
const connection = require('./database/database');

//Criando Tabelas e colunas
const usuario = require('./models/usuario');
const entregas = require('./models/entregas');
const servico = require('./models/servicos');
const bicicletario = require('./models/bicicletario');
const chaves = require('./models/chaves');
const lojas = require('./models/lojas');
const veiculos = require('./models/veiculos');
const documentos = require('./models/documentos');
const telefone = require('./models/telefone');
const registro_chaves = require('./models/registro_chave');
const registro_patio = require('./models/registro_patio');

const app = express();

// Sessão
app.use(session({
    secret: 'Controle',
    cookie: {
        maxAge: 2400000,
    },
    resave: true,
    saveUnitialized: false
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Banco de Dados
connection
 .authenticate()
 .then(() => {
    console.log('Conexão feita com Sucessso!');
 })

 .catch(erro => { 
     console.log(erro);
 });
 

module.exports = app;

//Módulos Internos
const path = require('path');

//Módulos Externos
const express = require('express');

//Modulos do Projeto
const connection = require('./database/database');



const app = express();

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

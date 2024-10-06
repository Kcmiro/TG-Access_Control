const express = require ('express');
const bcrypt = require ('bcryptjs');

const usuario = require('../models/usuario');
const { where } = require('sequelize');

exports.create = (req, res, next) => {
    const nome = req.body.nome;
    const senha = req.body.senha;
    const nivel = req.body.nivel;

    let salt = bcrypt.genSaltSync(10);
    let senhacriptografada = bcrypt(senha, salt);
    
    usuario.findOne({
        where: {
            usuario_nome: nome
        }
    }).then(Usuario =>{
        if(Usuario == undefined)
            {
                usuario.create({
                    usuario_nome: nome,
                    usuario_senha: senhacriptografada,
                    usuario_nivel: nivel
                }).then(resultado =>{
                    res.end('USUARIO CRIADO COM SUCESSO!!!');
                }).catch(err => {
                    console.log(err);
                    res.end('Erro!');
                })
            }
            else
            {
                res.end('USUARIO JÁ EXISTE!!!')
            }
    })
}

exports.login = (req, res, next) => {
    var nome = req.body.nome;
    var senha = req.body.senha;
    
    usuario.findOne({
        where: {
            usuario_nome: nome
        }
    }).then(Usuario =>{
        if(Usuario != undefined)
        {
            let usuario_logado = bcrypt.compareSync(senha, Usuario.usuario_senha)

            if(usuario_logado)
            {
                req.session.Usuario = {
                    id: Usuario.id,
                    nome: Usuario.usuario_nome
                }

                res.end('logado!!!');
            }
            else
            {
                req.end('Usuario ou senha não correspondente');
            }
        }
        else
        {
            req.end('Usuario ou senha não correspondente');
        }
    });

}
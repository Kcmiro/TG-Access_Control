const express = require ('express');
const Entregas = require('../models/entregas');
const entregas = require('../models/entregas');

exports.todasEntregas = (req, res, next) => {
    Entregas.findAll({
        order: [
            ['entregas_nome', 'ASC']
        ]
    }).then(todasEntregas => {
        res.render('entregas/index', {entregas: todasEntregas})
    })
}

exports.novaEntrega = (req, res, next)=>{
    res.render ('entregas/edit', {nova:true, msg:'',entregas:{}});
}

exports.create =(req, res, next) =>{
    
}
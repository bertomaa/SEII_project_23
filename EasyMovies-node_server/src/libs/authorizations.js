const dataChecker = require('./dataChecker');
const express = require('express');
const dbAdapter = require('./dbAdapter');
var router = express.Router();
var jwt = require('jsonwebtoken');
const fs  = require('fs');

const publicKey = fs.readFileSync('./public.key', 'utf8');

const authorizationCallBack = async (req, res, next) => {
    const username = req.params.username || req.body.username;
    if (dataChecker.checkFieldsNull([username]))
        res.status(400).send();
    if(!(await dataChecker.checkUsername(username))){
        res.status(404).send();
        return;
    }
    if (req.cookies && req.cookies.JWTtoken) {
        const token = req.cookies.JWTtoken;
        if (dataChecker.checkFieldsNull([token]))
            res.status(400).send();
        //console.log("ci sono i cookie");
        jwt.verify(token, publicKey, {algorithms: ["RS256"]}, (err, decoded) => {
            if (err) {
                //console.log("token non valido");
                return res.status(401).send();		
            } else {
                if(decoded.username === username){
                    //console.log("next!");
                    next('route');
                }
                else{
                    //console.log("token non appartiene a questo utente");
                    return res.status(401).send();
                }
            }
        });
    } else {
        //console.log("uuid non presente")
        res.status(401).send();
    }
}

module.exports = {
    authorizationCallBack
}
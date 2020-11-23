const dataChecker = require('./dataChecker');
const express = require('express');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('./exceptionHandler');
const dbAdapter = require('./dbAdapter');
var router = express.Router();

const authorizationCallBack = async (req, res, next) => {
    const username = req.params.username || req.body.username;
    if (dataChecker.checkFieldsNull([username]))
        res.status(400).send();
    if(!(await dataChecker.checkUsername(username))){
        res.status(404).send();
        return;
    }
    if (req.cookies && req.cookies.sessionId) {
        const uuid = req.cookies.sessionId;
        if (dataChecker.checkFieldsNull([uuid]))
            res.status(400).send();
        //console.log("ci sono i cookie")
        dbAdapter.checkUuid(username, uuid).then(r => {
            if (r) {
                // console.log("next!");
                next('route');
            } else {
                //console.log("uuid non valido");
                res.status(401).send();
            }
        })
    } else {
        //console.log("uuid non presente")
        res.status(401).send();
    }
}

module.exports = {
    authorizationCallBack
}
const dataChecker = require('./dataChecker');
const express = require('express');
const { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } = require('./exceptionHandler');
const dbAdapter = require('./dbAdapter');
var router = express.Router();

const authorizationCallBack = (req, res, next) => {
    console.log(req.cookies)
    if (req.cookies && req.cookies.sessionId) {
        const username = req.params.username;
        const uuid = req.cookies.sessionId;
        if (dataChecker.checkFieldsNull([username, uuid]))
            res.status(400).send();
        console.log("ci sono i cookie")
        dbAdapter.checkUuid(username, uuid).then(r => {
            if (r) {
                // console.log("next!");
                next('route');
            } else {
                console.log("uuid non valido");
                res.status(401).send();
            }
        })
    } else {
        console.log("uuid non presente")
        res.status(401).send();
    }
}

module.exports = {
    authorizationCallBack
}
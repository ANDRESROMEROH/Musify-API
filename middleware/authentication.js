'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_password';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message: "There is no authentication header..."});
    } 

    var token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: "Error: Token has expired!"});
        }
    } catch (e) {
        //console.log(e);
        return res.status(404).send({message: "Error: Token is not valid!"});
    }

    req.user = payload;
    next();
}; 
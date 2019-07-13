'use strict'

var jwt  = require('jwt-simple');
var moment = require('moment');
var secret = 'secret_password';

exports.createToken = function name(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //Token creation date...
        exp: moment().add(30, 'days').unix //Token expiration date...
    };

    return jwt.encode(payload, secret);
};
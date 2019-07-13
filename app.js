'use strict'

var express = require('express'); //Imports Express module
var bodyParser = require('body-parser'); //Imports Body-Parser Module

var app = express(); //Creates Express application

//To load paths/routes (Middleware functions):

var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album')
var song_routes = require('./routes/song')

/*Body parser will convert every request body to a JSON object automatically*/
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//HTTP Headers:
//https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//Base URLs:
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

// app.get('/test',function(req,res){ 
//     res.status(200).send({message: 'HTTP TEST METHOD'});
// });

module.exports = app; //Exports app module...
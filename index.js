//NodeJS Server
//API Last Update: January 26th, 2019

'user strict'

var mongoose = require('mongoose');  //Imports mongoose module
var app = require('./app'); //Imports app module

//So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
//var port = process.env.port || 3000;

mongoose.Promise = global.Promise; //Removes mongoose console warning...

mongoose.connect('mongodb://Andresromeroh:Elephant05@ds123976.mlab.com:23976/musify', 
{ useNewUrlParser: true }, (err, res) => {
    if (err) { //Always verify errors first...
        throw err;
    } else {
        console.log("The database connection is working...");

        app.listen(process.env.PORT || 5000, function(){ //Returns and HTTP server which will execute the callback once it is running.
            console.log("Server listening...");
        })
    }
}); //Remember to use CTRL + C to stop the NodeJS application!...


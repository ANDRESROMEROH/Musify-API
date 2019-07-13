'use strict'

var bcrypt = require('bcrypt-nodejs'); //Use for password encryption
var User = require('../models/user');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');


function testing(req,res) {
    res.status(200).send({
        message: "Doing some testing..."
    });
}


function saveUSer(req,res) {
    var user = new User();
    var params = req.body;

    //Assigning the values received from the request...
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;
    
    if (params.password) {
        //Encryption....
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;

            if (user.name != null && user.surname != null && user.email != null) {
                //Proceed to save the user:
                user.save((err, userStored)=> {
                    if (err) {
                        res.status(500).send({
                            message: "You need to fill out all the fields..."
                        });
                    } else {
                        if (!userStored) {
                            res.status(404).send({
                                message: "You need to fill out all the fields..."
                            });
                        } else {
                            res.status(200).send({
                                user: userStored
                            });
                        }
                    }
                });
            } else {
                res.status(200).send({
                    message: "You need to fill out all the fields..."
                });
            }
        });

    } else {
        res.status(200).send({
            message: "There was an error..."
        });
    }
}


function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({message: "There was an error..."});
        } else {
            if (!user) {
                res.status(404).send({message: "User does not exist!"});
            } else {

                //Verify the password:
                bcrypt.compare(password, user.password, (err, result) => {
                        if (result) {
                            if (params.gethash) {
                                //We return the JWT token:
                                res.status(200).send({
                                    token: jwt.createToken(user)
                                });
                            } else {
                                res.status(200).send({user});
                            }
                        } else {
                            res.status(404).send({message: "Incorrect password, please try again..."});
                        }
                });
            }
        }
    });
}


function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({message: "Error updating the user..."});
        } else {
            if (!userUpdated) {
                res.status(404).send({message: "It was not possible to update..."});
            } else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}


function uploadImage(req, res) {
    var userId = req.params.id;
    var fileName = 'Not uploaded';

    if (req.files) {

        // It separates the file name so it can be stored in the data base and linked to the actual file stored in the HDD
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var extension = extSplit[1];
        /*-----------------------------------*/

        if (extension == 'png' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif') {
            User.findByIdAndUpdate(userId, {image: fileName}, (err, user) => {
                if (err) {
                    res.status(404).send({message: "It was not possible to update the image..."});
                } else {
                    res.status(200).send({user: user, image: fileName});
                }
            });
        } else {
            res.status(200).send({message: 'Extension is not valid...'});
        }

    } else {
        res.status(200).send({message: 'No image was uploaded...'});
    }
}


function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    fs.exists('./uploads/users/' + imageFile, function (exists) {
        if (exists) {
            res.sendFile(path.resolve('./uploads/users/' + imageFile));
        } else {
            res.status(200).send({message: 'Image does not exist...'});
        }
    });
}


module.exports = {
    testing, 
    saveUSer,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};
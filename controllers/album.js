/* Pending Functions:
    uploadImage()
    getImageFile()
*/

'use strict'

var path = require('path');
var fs = require('fs');
var mongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId, (err, album) => {
        if (err) {
            res.status(500).send({message: "Request error."});
        } else {
            if (!album) {
                res.status(404).send({message: "Album does not exists."});
            } else {
                res.status(200).send({album});
            }
        }
    });
}

function getAllAlbums(req, res) {
    if (!req.params.page) {
        var page = 1;
    } else {
        var page = req.params.page;
    }

    var itemsPerPage = 10;

    Album.find().sort('name').paginate(page, itemsPerPage, function (err, albums, total) { 
        if (err) {
            res.status(500).send({message: "Request error."});
        } else {
            if (!albums) {
                res.status(404).send({message: "No albums were found."})
            } else {
                res.status(200).send({
                    pages: total,
                    albums: albums
                });
            }
        }
    })
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;


    album.save((err, albumStored) => 
            {
                if (err) {
                    res.status(500).send({message: 'There was an error saving the album.'});
                }else{
                    if (!albumStored) {
                        res.status(404).send({message: "Album was not saved."});
                    } else {
                        res.status(200).send({album: albumStored});
                    }
                }
            }
    );
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, updatedAlbum) => {
        if (err) {
            res.status(500).send({message: "There was an error updating the album."});
        } else {
            if (!updatedAlbum) {
                res.status(404).send({message: "Could not find the album to update..."});
            } else {
                res.status(200).send({updatedAlbum})
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, removedAlbum) => {
        if (err) {
            res.status(500).send({message: "There was an error deleting the artist."});
        } else {
            if (!removedAlbum) {
                res.status(404).send({message: "Could not find the album to delete..."});
            } else {
                Song.find({artist: removedAlbum._id}).remove((err,  removedSong) => {
                    if (err) {
                        res.status(500).send({message: "There was an error deleting the songs for a particular album."});
                    } else {
                        if (!removedSong) {
                            res.status(404).send({message: "Could not find songs for a particular album."});
                        } else {
                            res.status(200).send({removedAlbum});
                        }
                    }
                })
            }
        }
    })
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var fileName = 'Not uploaded';

    if (req.files) {

        // It separates the file name so it can be stored in the data base and be linked to the actual file stored in the HDD
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extSplit = fileName.split('\.');
        var extension = extSplit[1];
        /*-----------------------------------*/

        if (extension == 'png' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif') {
            Album.findByIdAndUpdate(albumId, {image: fileName}, (err, album) => {
                if (err) {
                    res.status(404).send({message: "It was not possible to update the image..."});
                } else {
                    res.status(200).send({album: album});
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
    fs.exists('./uploads/albums/' + imageFile, function (exists) {
        if (exists) {
            res.sendFile(path.resolve('./uploads/albums/' + imageFile));
        } else {
            res.status(200).send({message: 'Image does not exist...'});
        }
    });
}

module.exports = {
    getAlbum,
    getAllAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};
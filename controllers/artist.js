'use strict'

var path = require('path');
var fs = require('fs');
var mongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({message: "Request error."});
        } else {
            if (!artist) {
                res.status(404).send({message: "Artist does not exist."});
            } else {
                res.status(200).send({artist});
            }
        }
    });
}

function getAllArtists(req, res) {
    if (!req.params.page) {
        var page = 1;
    } else {
        var page = req.params.page;
    }

    var itemsPerPage = 10;

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) { 
        if (err) {
            res.status(500).send({message: "Request error."});
        } else {
            if (!artists) {
                res.status(404).send({message: "No artists were found."})
            } else {
                res.status(200).send({
                    pages: total,
                    artists: artists
                });
            }
        }
    })
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => 
            {
                if (err) {
                    res.status(500).send({message: 'There was an error saving the artist.'});
                }else{
                    if (!artistStored) {
                        res.status(404).send({message: "Artist was not saved."});
                    } else {
                        res.status(200).send({artist: artistStored});
                    }
                }
            }
    );
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, updatedArtist) => {
        if (err) {
            res.status(500).send({message: "There was an error updating the artist."});
        } else {
            if (!updatedArtist) {
                res.status(404).send({message: "Could not find the artist to update..."});
            } else {
                res.status(200).send({updatedArtist})
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, removedArtist) => {
        if (err) {
            res.status(500).send({message: "There was an error deleting the artist."});
        } else {
            if (!removedArtist) {
                res.status(404).send({message: "Could not find the artist to delete..."});
            } else {
                Album.find({artist: removedArtist._id}).remove((err, removedAlbum) => {
                    if (err) {
                        res.status(500).send({message: "There was an error deleting the albums for the artist."});
                    } else {
                        if (!removedAlbum) {
                            res.status(404).send({message: "Could not find albums for this artist."});
                        } else {
                            Song.find({album: removedAlbum._id}).remove((err, removedSong) => {
                                if (err) {
                                    res.status(500).send({message: "There was an error deleting the songs for a particular album."});
                                } else {
                                    if (!removedSong) {
                                        res.status(404).send({message: "Could not find songs for a particular album."});
                                    } else {
                                        res.status(200).send({removedArtist});
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

function uploadImage(req, res) {
    var artistId = req.params.id;
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
            Artist.findByIdAndUpdate(artistId, {image: fileName}, (err, artist) => {
                if (err) {
                    res.status(404).send({message: "It was not possible to update the image..."});
                } else {
                    res.status(200).send({artist: artist});
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
    fs.exists('./uploads/artists/' + imageFile, function (exists) {
        if (exists) {
            res.sendFile(path.resolve('./uploads/artists/' + imageFile));
        } else {
            res.status(200).send({message: 'Image does not exist...'});
        }
    });
}


module.exports = {
    getArtist,
    saveArtist,
    getAllArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
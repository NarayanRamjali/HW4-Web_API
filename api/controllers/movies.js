'use strict';

var _ = require('lodash');
var usergrid = require('usergrid');
var apigee = require('apigee-access');

module.exports = {
    getAll: getAll,
    newMovie: AddMovie,
    getOne: getOneMovie,
    updateMovie: updateMovie,
    remove: remove
};

var UsergridClient = require('../../node_modules/usergrid/lib/client');
var Usergrid = new UsergridClient({
    'appId' : "sandbox",
    'orgId' : 'rsmjsli1991',
    'authMode' : 'NONE',
    "baseUrl": "https://apibaas-trial.apigee.net",
    "URI": "https://apibaas-trial.apigee.net",
    'appName' : 'HW4',
    'clientId' : 'YXA6D_IpuSC0EeeiwhIuBzeXfQ',
    'clientSecret' : 'YXA6KO0FlXP65VLH1YA63xivilnDcmU'
});

function getAll (req,res){

    Usergrid.GET('movies', function(err, response, movie) {
        if(err){
            res.json({error: err});
        }
        else {
            console.log(response.entities);
            res.json({
                movies: response.entities
            }).end();
        }
    })
}
function AddMovie (req,res){

    var movies = req.swagger.params.movie.value.movie;
    _.assign(movies,{type: 'movie'});

    if(_.isUndefined(movies.actors))
        res.json({ Error: "Undefined Actor." });
    else if(_.isUndefined(movies.title))
        res.json({ Error: "Undefined Title." });
    else if(_.isUndefined(movies.year))
        res.json({ Error: "Undefined Year." });
    else if(_.isUndefined(movies.ID))
        res.json({ Error: "Undefined ID." });

    else
        Usergrid.POST(movies, function (err, response, movie) {
            if (err) {
                res.json({message: err});
            }
            else {
                movie.save(Usergrid, function (err) {

                    if (err) {
                        res.status(500).json(err).end();
                    }
                    else res.json({
                        message: 'Movie successfully added',
                        movie: response
                    }).end();
                });
            }
        })
}
function getOneMovie(req,res){

    var uuid = req.swagger.params.id.value;
    Usergrid.GET('movies',uuid, function(error, usergridResponse) {
        if (error){
            res.json({error: error});
        }
        else res.json({
            movie: usergridResponse
        }).end();
    })
}
function updateMovie(req,res){

    var uuid = req.swagger.params.id.value;

    Usergrid.GET('movies', uuid, function(error, usergridResponse, movie) {
        _.assign(movie, req.swagger.params.movie.value.movie);
        _.assign(movie, {type: 'movie'});

        Usergrid.PUT(movie, {uuid : uuid}, function (err, usergridResponse) {
            if(err){
                res.json({
                    error: err
                });
            }
            else {
                res.json({
                    message: 'movie successfully updated',
                    movie: usergridResponse
                })
            }
        });
    })
}
function remove(req,res){

    var uuid = req.swagger.params.id.value;
    Usergrid.DELETE('movies',uuid, function(error, usergridResponse) {
        if (error) {
            res.json({error: error});
        }
        else res.json({
            message: 'movie successfully deleted',
            movie: usergridResponse
        }).end();
    })
}
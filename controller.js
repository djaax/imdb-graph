const express 	= require('express');
const imdb 		= require('imdb-api');
const _ 		= require('lodash');

module.exports = function(app) {

	const server = express();

	server.get('/', (req, res) => {
		res.sendFile(app.dir + '/public/index.html');
	});

	function parse(episodes) {
		let i = 1; 	
    	var seasons = _.groupBy(episodes, "season");
    	return _.map(seasons, function(eps) {
    		return _.map(eps, function(e) {
	    		return [i++,parseFloat(e.rating)];
	    	});
    	});
	}

	server.get('/api/id/:id', (req, res) => {
		imdb.getById(req.params.id, { apiKey: app.config.get('OMDB_API_KEY')})
		.then(data => {
		    data.episodes()
		    .then((episodes) => {
		    	delete data._episodes;
		    	res.json({ data: data, out: parse(episodes) });
		    });
		})
		.catch(function(err) {
			console.log(err);
			res.sendStatus(404);
		});
	});

	server.get('/api/name/:name', (req, res) => {
		imdb.get(req.params.name, { apiKey: app.config.get('OMDB_API_KEY')})
		.then(data => {
		    data.episodes()
		    .then((episodes) => {
		    	delete data._episodes;
		    	res.json({ data: data, out: parse(episodes) });
		    });
		})
		.catch(function(err) {
			console.log(err);
			res.sendStatus(404);
		});
	});

	return server;
}
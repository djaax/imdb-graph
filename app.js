'use strict';

const express 			= require('express');
const http				= require('http');
const path				= require('path');
const fs				= require('fs');
const bodyParser		= require('body-parser');
const methodOverride	= require('method-override');
const nconf 			= require('nconf');


let app = module.exports = {};


/*
 * CONFIG
 */
app.dir	= __dirname;


/*
 * SERVER CONFIG
 */
app.express	 = express();
app.server	 = http.createServer(app.express);

app.config = nconf.argv()
   .env()
   .file({ file: 'config.json' });

app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({ extended: false }));
app.express.use(methodOverride());

app.express.use(require(app.dir + '/controller.js')(app));

// Static Files
app.express.use(express.static(path.join(app.dir, 'public')));
app.express.use(express.static(path.join(app.dir, 'node_modules')));

// 404
app.express.use(function(req, res, next) {
	res.status(404);

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
});

// Basic error handler
app.express.use((err, req, res, next) => {
	/* jshint unused:false */
	console.error(err);
	// If our routes specified a specific response, then send that. Otherwise,
	// send a generic message so as not to leak anything.
	res.status(500).send(err.response || 'Something broke!');
});


/*
 * SERVER STARTUP
 */
var port = process.env.PORT || 8123;
app.server.listen(port, function() {
	console.log('Server listening on port ' + port);
});

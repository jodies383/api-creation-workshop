require('dotenv').config()
const express = require('express');
const { get } = require('express/lib/request');
const app = express();
const fs = require("fs");
const axios = require('axios');
const jwt = require('jsonwebtoken')
// enable the static folder...
app.use(express.static('public'));
// enable the req.body object
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// import the dataset to be used here
const garments = require('./garments.json');
const { json } = require('express/lib/response');

const GarmentManager = require('./shop/garment-manager');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://jodie@localhost:5432/missy_tee_app';

const pool = new Pool({
	connectionString,
});

const garmentManager = GarmentManager(pool);

const PORT = process.env.PORT || 4017;

// API routes to be added here


app.post('/api/login', (req, res, next) => {
	const { username } = req.body;

	// console.log(req.body)

	const token = jwt.sign({
		username
	}, process.env.ACCESS_TOKEN_SECRET);

	res.json({
		token
	});

})
function verifyToken(req, res, next) {

	const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
	if (!req.headers.authorization || !token) {
		res.sendStatus(401);
		return;
	}


	const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

	const { username } = decoded;

	if (username && username === process.env.USERNAME) {
		next();
	} else {
		res.sendStatus(403);
	}

}

app.get('/api/garments', verifyToken, async function(req, res){

	const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = await garmentManager.filter({
		gender,
		season
	});

	res.json({ 
		garments : filteredGarments
	});
});

app.get('/api/garments/price/:price', async function(req, res){

	const maxPrice = Number(req.params.price);
	const filteredGarments = await garmentManager.filterByPrice(maxPrice);

	res.json({ 
		garments : filteredGarments
	});
});
app.post('/api/garments', (req, res) => {
	// get the fields send in from req.body
	const {
		description,
		img,
		gender,
		season,
		price
	} = req.body;

	// add some validation to see if all the fields are there.
	// only 3 fields are made mandatory here
	// you can change that

	if (!description || !img || !price || !gender || !season) {
		res.json({
			status: 'error',
			message: 'Required data not supplied',
		});
	} else {

		// you can check for duplicates here using garments.find
		if (garments.find(element => element.description === description)) {
			res.json({
				status: 'error',
				message: 'Item already exists',
			});
		}
		else {

			// add a new entry into the garments list
			garments.push({
				description,
				img,
				gender,
				season,
				price
			});
			//adding garments into the JSON file
			fs.writeFileSync('./garments.json', JSON.stringify(garments))

			res.json({
				status: 'success',
				message: 'New garment added.',
			});
		}
	}

});
app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});


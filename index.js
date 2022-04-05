const express = require('express');
const { get } = require('express/lib/request');
const app = express();

// enable the static folder...
app.use(express.static('public'));
// enable the req.body object
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// import the dataset to be used here
const garments = require('./garments.json');

const PORT = process.env.PORT || 4017;

// API routes to be added here
app.get('/api/garments', function (req, res) {
	const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = garments.filter(garment => {
		// if both gender & season was supplied
		if (gender != 'All' && season != 'All') {
			return garment.gender === gender
				&& garment.season === season;
		} else if (gender != 'All') { // if gender was supplied
			return garment.gender === gender
		} else if (season != 'All') { // if season was supplied
			return garment.season === season
		}
		return true;
	});
	// note that this route just send JSON data to the browser
	// there is no template
	res.json({ garments: filteredGarments });
});
app.get('/api/garments/price/:price', function(req, res){
	const maxPrice = Number(req.params.price);
	const filteredGarments = garments.filter( garment => {
		// filter only if the maxPrice is bigger than maxPrice
		if (maxPrice > 0) {
			return garment.price <= maxPrice;
		}
		return true;
	});

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

	if (!description || !img || !price) {
		res.json({
			status: 'error',
			message: 'Required data not supplied',
		});
	} else {

		// you can check for duplicates here using garments.find
		
		// add a new entry into the garments list
		garments.push({
			description,
			img,
			gender,
			season,
			price
		});

		res.json({
			status: 'success',
			message: 'New garment added.',
		});
	}

});
app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});


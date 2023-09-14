var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var HotelService = require('../services/HotelService');
var db = require('../models');
var hotelService = new HotelService(db);
var createError = require('http-errors');

/* GET hotels listing. */
router.get('/', async function (req, res, next) {
	// #swagger.tags = ['Hotels']
	// #swagger.description = "Gets the list of all available hotels."
	// #swagger.produces = ['text/html']
	// #swagger.responses = [200]
	const hotels = await hotelService.get();
	res.render('hotels', { hotels: hotels });
});

router.get('/:hotelId', async function (req, res, next) {
	const hotel = await hotelService.getHotelDetails(req.params.hotelId);
	res.render('hotelDetails', { hotel: hotel });
});

router.post('/:hotelId/rate', jsonParser, async function (req, res, next) {
	let value = req.body.Value;
	let userId = req.body.UserId;
	await hotelService.makeARate(userId, req.params.hotelId, value);
	res.end();
});

router.post('/', jsonParser, async function (req, res, next) {
	// #swagger.tags = ['Hotels']
	// #swagger.description = "Creates a new hotel."
	/* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/Hotel"
      }
    }
		
  */
	if (req.body.Name == null || req.body.Location == null) {
		next(createError(400, 'Both Name and Location need to be provided in the request'));
	}
	let Name = req.body.Name;
	let Location = req.body.Location;
	await hotelService.create(Name, Location);
	res.status(200).end();
});

router.delete('/', jsonParser, async function (req, res, next) {
	let id = req.body.id;
	await hotelService.deleteHotel(id);
	res.status(200).end();
});

router.delete('/:id', jsonParser, async function (req, res, next) {
	await hotelService.deleteHotel(req.params.id);
	res.end();
});

module.exports = router;

const express = require('express');
var http = require('http');
const request = require('request-promise');
const fetch = require("node-fetch");
const router = express.Router();
const RequestCall = require('../../models/requestCall');
const verifyToken = require('../../middleware/auth');
const requestPromise = require('request-promise');

// const cors = require('cors');
// router.use(cors({
//     origin: '*'
// }));


// ---------------------------------------------------------
// route to get request call of a user
// ---------------------------------------------------------
router.get('/byUser', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if (!req.query.address) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the user information 
	let requestCalls = await RequestCall.find({"address": req.query.address});
	res.status(200).json(requestCalls.map(rC => {
		return {
      name: rC.name, 
      address: rC.address, 
      result: rC.result,
      dateTime: rC.dateTime,
      message: rC.message,
			self: "/api/v1/requestCalls/byUser/" + rC.address
		}
	}));
});

// ---------------------------------------------------------
// route to set new request call
// ---------------------------------------------------------
router.post('', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.body.address || !req.body.name) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the user information 
	let request = await RequestCall.findOne({"address": req.body.address, "name": req.body.name});
	console.log(request)
	if (request != null || request.result == true) {
		res.status(409).json({
			success: false,
			message: 'Request already done'
        });
		return;
	}

  let call = (await requestPromise("http://localhost:8080/api/v1/call?name=" + req.body.name)
    .then(response => JSON.parse(response)));

  let user = (await requestPromise("http://localhost:8080/api/v1/user/getAllInfo?address=" + req.body.address)
  .then(response => JSON.parse(response)));
  user = user.user;

  let requestResult = true;

  if(user.ISEE > call.ISEE || user.averageRating < call.averageRating || user.credits < call.credits || user.birthYear < call.birthYear){
    requestResult = false;
  }

  var dateTime = new Date();
  var message = "Request in list";

  if(requestResult == false){
    message = "Requirements not satisfied";  
  }
  
  const newRequest = await RequestCall.create({
    name: req.body.name, 
    address: req.body.address, 
    result: requestResult,
    dateTime: dateTime,
    message: message
  });      

	res.status(200).json({
    name: newRequest.name, 
    address: newRequest.address, 
    result: newRequest.requestResult,
    dateTime: newRequest.dateTime,
    message: newRequest.message,
		self: "/api/v1/requestCall"
	});
});

module.exports = router;
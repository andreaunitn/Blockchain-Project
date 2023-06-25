const express = require('express');
var http = require('http');
const request = require('request-promise');
const fetch = require("node-fetch");
const router = express.Router();
const RequestCall = require('../../models/requestCall');
const verifyToken = require('../../middleware/auth');
const requestPromise = require('request-promise');
const dotenv = require('dotenv').config({path: __dirname + "/.env"}); //FIX
const Provider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
var provider = new Provider({privateKeys: ["0x9187b08e9587d673244bf9bf0ca92cd1e1e98d2ba6718e3b5af188a52e0e49eb"], providerOrUrl: 'http://127.0.0.1:7545'});
const web3 = new Web3(provider);
const fs = require("fs");
const path = require('path');


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
	if (request != null && request.result == true) {
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

  if(user.ISEE > call.ISEE || user.averageRating < call.averageRating || user.credits < call.credits){
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
  
  file = fs.readFileSync(path.resolve(__dirname, "../../../build/contracts/MyContract.json"));
  var output = JSON.parse(file);

  var contractABI = output.abi; 
  
  var statusIndex = 0;
  if(user.status == "PENDOLARE"){
	statusIndex = 1;
  } else if(user.status == "FUORI_SEDE"){
	statusIndex = 2;
  }
  
  let operaAccount = "";
  web3.eth.getAccounts().then((accounts) => {
	  operaAccount = accounts[0];
  	  let contract = new web3.eth.Contract(contractABI, call.contractAddress);
	  contract.methods.addStudent(user.ISEE, user.credits, user.uniYear, req.body.address, statusIndex).send({from:operaAccount}).then(response => {
			
			contract.methods.getStudent(req.body.address).call().then(res => {
				const student = {
					isee: Number(res.isee),
					crediti: Number(res.credits),
					year: Number(res.year),
					score: Number(res.score)
				};
				console.log(student);

				res.status(200).json({
					name: newRequest.name, 
					address: newRequest.address, 
					result: newRequest.requestResult,
					dateTime: newRequest.dateTime,
					message: newRequest.message,
					self: "/api/v1/requestCall"
				});
			})
	  })
  })
});

module.exports = router;
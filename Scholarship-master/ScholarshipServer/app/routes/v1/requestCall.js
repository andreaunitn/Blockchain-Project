const express = require('express');
const router = express.Router();
const RequestCall = require('../../models/requestCall');
const requestPromise = require('request-promise');
const dotenv = require('dotenv').config({path: __dirname + "/../../../.env"});
const Provider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
var provider = new Provider({privateKeys: [process.env.OPERA_PRIVATE_KEY], providerOrUrl: 'http://127.0.0.1:7545'});
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
			eligible: rC.eligible, 
			released: rC.released,
			fund: rC.fund,
			dateTime: rC.dateTime,
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
	if (request != null) {
		res.status(409).json({
			success: false,
			message: 'Request already done'
        });
		return;
	}

  let call = (await requestPromise("http://localhost:8080/api/v1/call?name=" + req.body.name)
    .then(response => JSON.parse(response)));

  var user
	try {
		user = await requestPromise("http://localhost:8080/api/v1/user/getAllInfo?address=" + req.body.address);
		user = JSON.parse(user);
		user = user.user
	} catch (error) {
		if (error.statusCode === 404) {
			res.status(404).json({
				success: false,
				message: 'Missing student data'
			});
		}
		return;
	}

  let eligible = true;
  if(user.ISEE > call.ISEE || user.credits < call.credits[user.uniYear-1]){
	eligible = false;
  }

  var dateTime = new Date();
   
  
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
	  let isee = Math.max(Math.floor(user.ISEE/1000), 1); //0 not allowed in contract
	  contract.methods.addStudent(isee, user.credits, user.uniYear, req.body.address, statusIndex).send({from:operaAccount}).then(async response => {
		
		const newRequest = await RequestCall.create({
			name: req.body.name, 
			address: req.body.address, 
			eligible: eligible,
			released: false,
			fund: 0,
			dateTime: dateTime,
		  }); 

		res.status(200).json({
			name: newRequest.name, 
			address: newRequest.address,
			eligible: newRequest.eligible, 
			released: newRequest.released,
			fund: newRequest.fund,
			dateTime: newRequest.dateTime,
			self: "/api/v1/requestCall"
		});
	  }).catch(err => res.status(400).json({ success: false, message: 'Invalid parameters' }));
  })
});

module.exports = router;
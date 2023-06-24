const express = require('express');
const router = express.Router();
const Call = require('../../models/call');
const verifyToken = require('../../middleware/auth');
const fetch = require('node-fetch')
const Provider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
var provider = new Provider({privateKeys: ["0x9187b08e9587d673244bf9bf0ca92cd1e1e98d2ba6718e3b5af188a52e0e49eb"], providerOrUrl: 'http://127.0.0.1:7545'});
const web3 = new Web3(provider);
const fs = require("fs");


// ---------------------------------------------------------
// route to get all the calls
// ---------------------------------------------------------
router.get('/all', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	// find the call information 
	let calls = await Call.find({});
	res.status(200).json(calls.map(call => {
		return {
			name: call.name,
			description: call.description,
            ISEE: call.ISEE,
            residenceRegion: call.residenceRegion,
            credits: call.credits,
            averageRating: call.averageRating,
            birthYear: call.birthYear,
            endDate: call.endDate,
			self: "/api/v1/calls/" + call.name
		}
	}));
});

// ---------------------------------------------------------
// route to get the call selected
// ---------------------------------------------------------
router.get('', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.query.name) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the call information 
	let call = await Call.findOne({"name": req.query.name});
	res.status(200).json({
		name: call.name,
		description: call.description,
		ISEE: call.ISEE,
		residenceRegion: call.residenceRegion,
		credits: call.credits,
		averageRating: call.averageRating,
		birthYear: call.birthYear,
		endDate: call.endDate,
		self: "/api/v1/calls/" + call.name
	});
});

// ---------------------------------------------------------
// route to get the call selected
// ---------------------------------------------------------
router.post('', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if (!req.body.name || req.body.name == "" || !req.body.description || req.body.description == "" 
		|| !req.body.residenceRegion || req.body.residenceRegion == "") {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the call information 
	let call = await Call.findOne({"name": req.body.name});

	if(call != null){
		res.status(409).json({
			success: false,
			message: 'Another call has the same name'
		});
		return;
	}
	
	file = fs.readFileSync("/home/nicola/Scrivania/Blockchain-Project/Scholarship-master/ScholarshipServer/build/contracts/MyContract.json");
	var output = JSON.parse(file);

	var contractABI = output.abi;
	var bytecode = output.bytecode;

	contract = new web3.eth.Contract(contractABI);
	let newContract;
	web3.eth.getAccounts().then((accounts) => {
		console.log(accounts)
		mainAccount = accounts[0];
		console.log(mainAccount);
		contract
			.deploy({data: bytecode, arguments: [25000, 256]})
			.send({from: mainAccount})
			.on("receipt", (receipt) => {
				console.log("Contract address: ", receipt.contractAddress);
				newContract = new web3.eth.Contract(contractABI, receipt.contractAddress);
			})
			.then((initialContract) => {
				console.log("FUNZIONE");
				newContract.methods.getValue().call().then(response => console.log(Number(response)));
				newContract.methods.incrementValue().send({from: mainAccount}).then(response => {					
					console.log("Increase");
					newContract.methods.getValue().call().then(response => console.log(Number(response)));
				}
				);
			})
	})
	/*
	web3.eth.getAccounts().then((accounts) => {
		console.log(accounts)
		mainAccount = accounts[0];
		console.log(mainAccount);
		contract.methods.getValue();
		contract
			.deploy({data: bytecode})
			.send({from: mainAccount})
			.on("receipt", (receipt) => {
				console.log("Contract address: ", receipt.contractAddress);
			})
			.then((initialContract) => {

			})
	})*/

		 /**
	const newCall = await Call.create({
		name: req.body.name,
		description: req.body.description,
		ISEE: req.body.ISEE,
		residenceRegion: req.body.residenceRegion,
		credits: req.body.credits,
		averageRating: req.body.averageRating,
		birthYear: req.body.birthYear,
		endDate: req.body.endDate
	});*/

	res.status(200).json({
		success: true,
		message: "Created correctly",
		//self: "/api/v1/calls/" + newCall.name
	});
});

module.exports = router;
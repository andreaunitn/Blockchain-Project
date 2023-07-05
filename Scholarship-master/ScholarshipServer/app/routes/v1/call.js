const express = require('express');
const router = express.Router();
const Call = require('../../models/call');
const Provider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv').config({path: __dirname + "/../../../.env"});
const { Web3 } = require('web3');
const RequestCall = require('../../models/requestCall');
var provider = new Provider({privateKeys: [process.env.OPERA_PRIVATE_KEY], providerOrUrl: 'http://127.0.0.1:7545'});
const web3 = new Web3(provider);
const fs = require("fs");
const path = require('path');

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
			budget: call.budget,
            credits: call.credits,
			funds: call.funds,
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
		contractAddress: call.contractAddress,
		name: call.name,
		description: call.description,
		ISEE: call.ISEE,
		budget: call.budget,
		credits: call.credits,
		funds: call.funds,
		endDate: call.endDate,
		self: "/api/v1/calls/" + call.name
	});
});

// ---------------------------------------------------------
// route to get the ranking
// ---------------------------------------------------------
router.get('/ranking', async function (req, res) {
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

	if(call == null){
		res.status(404).json({
			success: false,
			message: 'Call not found'
		});
		return;
	}

	file = fs.readFileSync(path.resolve(__dirname, "../../../build/contracts/MyContract.json"));
	var output = JSON.parse(file);

	var contractABI = output.abi;
	
	let operaAccount = "";
	web3.eth.getAccounts().then(async (accounts) => {
		operaAccount = accounts[0];
		let contract = new web3.eth.Contract(contractABI, call.contractAddress);

		contract.methods.getStudents().call({from: operaAccount}).then(result => {			
			res.status(200).json(result.map(orderedCall => {
				let status = "IN_SEDE";
				if(Number(orderedCall._status) == 1){
					status = "PENDOLARE";
				} else if(Number(orderedCall._status) == 2){
					status = "FUORI_SEDE";
				}
				return {
					address: orderedCall.accountAddress,
					ISEE: Number(orderedCall.isee),
					credits: Number(orderedCall.credits),
					year: Number(orderedCall.year),
					score: Number(orderedCall.score),
					funds: Number(orderedCall.funds),
					status: status,
					self: "/api/v1/calls/" + orderedCall.accountAddress
				}
			}));
		}).catch(err => console.log(err));
	})
	
});



// ---------------------------------------------------------
// route to add a new call
// ---------------------------------------------------------
router.post('', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if (!req.body.name || req.body.name == "" || !req.body.description || req.body.description == "") {
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
	
	file = fs.readFileSync(path.resolve(__dirname, "../../../build/contracts/MyContract.json"));
	var output = JSON.parse(file);

	var contractABI = output.abi;
	var bytecode = output.bytecode;

	contract = new web3.eth.Contract(contractABI);
	
	let contractAddress;
	web3.eth.getAccounts().then((accounts) => {
		operaAccount = accounts[0];
		contract
			.deploy({data: bytecode, arguments: [req.body.budget, Math.floor(req.body.ISEE/1000), req.body.credits, req.body.funds, req.body.name, (req.body.endDate).toString()]})
			.send({from: operaAccount})
			.on("receipt", async (receipt) => {
				contractAddress = receipt.contractAddress;
				console.log("Contract address: ", contractAddress);

				const newCall = await Call.create({
					contractAddress: contractAddress,
					name: req.body.name,
					description: req.body.description,
					ISEE: req.body.ISEE,
					budget: req.body.budget,
					credits: req.body.credits,
					funds: req.body.funds,
					endDate: req.body.endDate
				});
			
				res.status(200).json({
					success: true,
					message: "Created correctly",
					self: "/api/v1/calls/" + newCall.name
				});
			})
			.then((initialContract) => {})
			.catch((error)=>{
				res.status(400).json({
					success: false,
					message: "Impossible to deploy contract, wrong parameters"
				});
			})
	})
});

// ---------------------------------------------------------
// route to compute the final ranking and assign fundind
// ---------------------------------------------------------
router.post('/computeRanking', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if (!req.body.name || req.body.name == "") {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the call information
	let call = await Call.findOne({"name": req.body.name});

	if(call == null){
		res.status(404).json({
			success: false,
			message: 'Call not found'
		});
		return;
	}
	
	file = fs.readFileSync(path.resolve(__dirname, "../../../build/contracts/MyContract.json"));
	var output = JSON.parse(file);

	var contractABI = output.abi;
	
	let operaAccount = "";
	web3.eth.getAccounts().then((accounts) => {
		operaAccount = accounts[0];
		let contract = new web3.eth.Contract(contractABI, call.contractAddress);
		contract.methods.rankStudents().send({from: operaAccount}).then(response => {
				//console.log("Ranking completed");
				contract.methods.assignFunding().send({from: operaAccount}).then(async response => {
					//console.log("Funding assignment completed");
					contract.methods.getStudents().call({from: operaAccount}).then(async result => {
						for(let i = 0; i < result.length; i++){
							if(result[i].funds > 0){
								await RequestCall.updateOne({'name': req.body.name, "address": (result[i].accountAddress).toLowerCase()}, {"released": true, "fund": Number(result[i].funds)});
							}
						}
						///// THIS IS ONLY NEEDED FOR DEMO SHOWING
						await Call.updateOne({'name': req.body.name}, {"endDate": new Date()});
						
						res.status(200).json({
							message: "Completed"
						});
					}).catch(err => console.log(err));
				}).catch(err => 
					res.status(400).json({
						message: "Error in assigning funds"
					}));
		}).catch(err => 
			res.status(400).json({
				message: "No student to compute ranking"
			})
		);
	})
});


module.exports = router;

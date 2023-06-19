const express = require('express');
const router = express.Router();
const Call = require('../../models/call');
const verifyToken = require('../../middleware/auth');
const web3 = new Web3('http://127.0.0.1:7545')

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

async function deployContract() {

	const operaAddress = global.operaAddress;
	console.log(operaAddress);

	if (operaAddress==='')
	  {
		alert("Not connected to MetaMask!");
		return;
	  }
  
	fetch('http://localhost:8080/contracts/MyContract.json', {
		 method: 'GET',
		 headers: {
			 'Accept': 'application/json',
		 },
	 })
		 .then(response => response.json())
		 .then(response => {
		   var bytecode = response.bytecode
  
		   let encodedArguments =web3.eth.abi.encodeParameter('string', 'default').substring(2);
  
		   ethereum.request({
			 method: 'eth_sendTransaction', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
			 params: [{
			   from: operaAddress,
			   data: bytecode+encodedArguments
			 }]
		   }).then((transactionHash)=>{
			 console.log(transactionHash)
			 web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
			   if (receipt && receipt.contractAddress) {
				 contractAddress = receipt.contractAddress;
				 console.log("!!",contractAddress);
			   }
			 });
  
		   }).catch((error)=>{
			 console.log(error)
		   })
		 })
  }

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

	const operaAddress = global.operaAddress;
	console.log(operaAddress);

	if (operaAddress==='')
	  {
		alert("Not connected to MetaMask!");
		return;
	  }
  
	fetch('http://localhost:8080/contracts/MyContract.json', {
		 method: 'GET',
		 headers: {
			 'Accept': 'application/json',
		 },
	 })
		 .then(response => response.json())
		 .then(response => {
		   var bytecode = response.bytecode
  
		   let encodedArguments =web3.eth.abi.encodeParameter('string', 'default').substring(2);
  
		   ethereum.request({
			 method: 'eth_sendTransaction', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
			 params: [{
			   from: operaAddress,
			   data: bytecode+encodedArguments
			 }]
		   }).then((transactionHash)=>{
			 console.log(transactionHash)
			 web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
			   if (receipt && receipt.contractAddress) {
				 contractAddress = receipt.contractAddress;
				 console.log("!!",contractAddress);
			   }
			 });
  
		   }).catch((error)=>{
			 console.log(error)
		   })
		 })



	const newCall = await Call.create({
		name: req.body.name,
		description: req.body.description,
		ISEE: req.body.ISEE,
		residenceRegion: req.body.residenceRegion,
		credits: req.body.credits,
		averageRating: req.body.averageRating,
		birthYear: req.body.birthYear,
		endDate: req.body.endDate
	});

	res.status(200).json({
		success: true,
		message: "Created correctly",
		self: "/api/v1/calls/" + newCall.name
	});
});

module.exports = router;
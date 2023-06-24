const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const verifyToken = require('../../middleware/auth');
const requestPromise = require('request-promise');


// ---------------------------------------------------------
// route to get personal information
// ---------------------------------------------------------
router.get('/getAllInfo', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.query.address) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}


	// find the user information
	let user = await User.findOne({"address": req.query.address});
	if (user == null) {
		res.status(404).json({
			success: false,
			message: 'User information not found'
		});
		return;
	}

	let uniInfo = (await requestPromise("http://localhost:8080/api/v1/university?fiscalCode=" + user.fiscalCode)
	.then(response => JSON.parse(response)));

	let ecoInfo = (await requestPromise("http://localhost:8080/api/v1/economic?fiscalCode=" + user.fiscalCode)
	.then(response => JSON.parse(response)));

	let personalInfo = (await requestPromise("http://localhost:8080/api/v1/personal?fiscalCode=" + user.fiscalCode)
	.then(response => JSON.parse(response)));

	let userInfo = {
		fiscalCode: user.fiscalCode,
		name: personalInfo.name,
		surname: personalInfo.surname,
		birthYear: personalInfo.birthYear,
		residenceRegion: personalInfo.residenceRegion,
		ISEE: ecoInfo.ISEE,
		fiscalCode: uniInfo.fiscalCode,
		averageRating: uniInfo.averageRating,
		credits: uniInfo.credits,
		offCourse: uniInfo.offCourse
	}

	res.status(200).json({
		user: userInfo,
		self: "/api/v1/user/getAllInfo/" + user.fiscalCode
	});
});


// ---------------------------------------------------------
// route to get personal information
// ---------------------------------------------------------
router.post('/login', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.body.address) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the user information
	let user = await User.findOne({"address": req.body.address});
	if (user == null) {
		res.status(404).json({
			success: false,
			message: 'User information not found'
		});
		return;
	}

	res.status(200).json({
		address: user.address,
		fiscalCode: user.fiscalCode,
		self: "/api/v1/user/" + user.fiscalCode
	});
});

// ---------------------------------------------------------
// route to get personal information
// ---------------------------------------------------------
router.post('/loginAdmin', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.body.username || !req.body.psw) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	if(req.body.username != "admin" || req.body.psw != "admin"){
		res.status(404).json({
			success: false,
			message: 'Wrong username or password'
		});
		return;
	}
	
	res.status(200).json({
		username: req.body.username
	});
});

router.post('/signUp', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (!req.body.fiscalCode || !req.body.address) {
		res.status(400).json({ success: false, message: 'Bad Request. Check docs for required parameters.' });
		return;
	}

	// find the user information
	let user = await User.find({ $or:[{"address": req.body.address}, {"fiscalCode": req.body.fiscalCode}]});
	if (user.length != 0) {
		console.log(user);
		res.status(409).json({
			success: false,
			message: 'User already exists with the same fiscalCode or address'
		});
		return;
	}

	const newUser = await User.create({
		fiscalCode: req.body.fiscalCode,
		address: req.body.address,
	});

	if (newUser == null) {
		res.status(409).json({
			success: false,
			message: 'Problem in the creation'
		});
		return;
	}

	res.status(200).json({
		address: newUser.address,
		fiscalCode: newUser.fiscalCode,
		self: "/api/v1/user/" + newUser.fiscalCode
	});
});

router.get('/getStudent', async function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if (req.query.address==='')
    {
      alert("Not connected to MetaMask!");
      return;
    }

  fetch('http://localhost:3000/contracts/MyContract.json', {
       method: 'GET',
       headers: {
           'Accept': 'application/json',
       },
   })
       .then(response => response.json())
       .then(response => {
         var abi = response.abi

         const contract = new web3.eth.Contract(abi, req.query.contractAddress)

         let f = contract.methods.getStudent(req.query.address).encodeABI();

         ethereum.request({
           method: 'eth_call', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
           params: [{
             from: req.query.address,
             to: req.query.contractAddress,
             data: f
           }]
         }).then(async (res)=>{

          const result = web3.eth.abi.decodeParameter('tuple(string,string,string,uint256,uint256,uint256,uint256)', res);

          const student = {
            name: result[0],
            surname: result[1],
            taxcode: result[2],
            isee: result[3],
            crediti: result[4],
            year: result[5],
            score: result[6]
          };

          console.log(student);

          //iteration test
          // const keys = await contract.methods.getKeys().call();
          // console.log(keys.length)
          // for (let i = 0; i < keys.length; i++) {
          //   const key = keys[i];
          //   const value = await contract.methods.getStudent(key).call();
          //   console.log(`Key: ${key}, Value: ${value}`);
          // }

         }).catch((error)=>{
           console.log(error)
         })
       })
})

module.exports = router;

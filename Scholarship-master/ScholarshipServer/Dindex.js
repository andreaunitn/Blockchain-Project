const express = require('express');
const Web3 = require('web3');

const app = express();


app.use(express.json());

app.use('/', express.static('./UI/'));


app.listen(process.env.PORT || 3000, function () {
    console.log('Server running on port ', process.env.PORT || 3000);
});

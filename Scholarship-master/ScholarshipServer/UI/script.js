var myAccountAddress=''
let web3 = new Web3('http://127.0.0.1:7545')
var receiverAddress=''

async function connectToMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined' && ethereum.on) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //handle account change
        // Subscribe to the "accountsChanged" event

        // Accounts now exposed
        console.log("Connected to MetaMask!");
        myAccountAddress = accounts[0];
        console.log("your account address is: " + myAccountAddress);
        //changeButtonView("block");
    }
    else {
        console.log("MetaMask is not installed.");
    }
}

async function deployContract() {

  if (myAccountAddress==='')
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
         var bytecode = response.bytecode

         let encodedArguments =web3.eth.abi.encodeParameter('string', 'default').substring(2);

         ethereum.request({
           method: 'eth_sendTransaction', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
           params: [{
             from: myAccountAddress,
             data: bytecode+encodedArguments
           }]
         }).then((transactionHash)=>{
           console.log(transactionHash)
           web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
             if (receipt && receipt.contractAddress) {
               receiverAddress = receipt.contractAddress;
               console.log("!!",receiverAddress)
             }
           });

         }).catch((error)=>{
           console.log(error)
         })
       })
}


async function getValueFromSmartConctract() {

  if (myAccountAddress==='')
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

         const contract = new web3.eth.Contract(abi, receiverAddress)

         let f = contract.methods.getValue().encodeABI();

         ethereum.request({
           method: 'eth_call', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
           params: [{
             from: myAccountAddress,
             to: receiverAddress,
             data: f
           }]
         }).then((res)=>{

           const result = web3.eth.abi.decodeParameter('uint',res)
           console.log(result)

         }).catch((error)=>{
           console.log(error)
         })
       })
}

async function setValueOfSmartConctract() {

  if (myAccountAddress==='')
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

         const contract = new web3.eth.Contract(abi, receiverAddress)

         let f = contract.methods.incrementValue().encodeABI();

         ethereum.request({
           method: 'eth_sendTransaction', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
           params: [{
             from: myAccountAddress,
             to: receiverAddress,
             data: f
           }]
         }).then((res)=>{

           const result = web3.eth.abi.decodeParameter('uint',res)
           console.log(result)

         }).catch((error)=>{
           console.log(error)
         })
       })
}


async function getStudentFromSmartConctract(address) {

  if (myAccountAddress==='')
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

         const contract = new web3.eth.Contract(abi, receiverAddress)

         let f = contract.methods.getStudent(address).encodeABI();

         ethereum.request({
           method: 'eth_call', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
           params: [{
             from: myAccountAddress,
             to: receiverAddress,
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
          const keys = await contract.methods.getKeys().call();
          console.log(keys.length)
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = await contract.methods.getStudent(key).call();
            console.log(`Key: ${key}, Value: ${value}`);
          }

         }).catch((error)=>{
           console.log(error)
         })
       })
}

async function addStudentToSmartContract(name, surname, taxcode, isee, crediti, year, address) {

  if (myAccountAddress==='')
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

         const contract = new web3.eth.Contract(abi, receiverAddress)

         const addPersonData  = contract.methods.addStudent(name, surname, taxcode, isee, crediti, year, address).encodeABI();

         ethereum.request({
           method: 'eth_sendTransaction', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
           params: [{
             from: myAccountAddress,
             to: receiverAddress,
             data: addPersonData
           }]
         }).then((res)=>{

           const result = web3.eth.abi.decodeParameter('uint',res)
           console.log('Transaction hash:', result);

         }).catch((error)=>{
           console.log(error)
         })
       })
}

async function rankStudents() {

  if (myAccountAddress==='')
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

         const contract = new web3.eth.Contract(abi, receiverAddress)

         let f = contract.methods.rankStudents().encodeABI();

         ethereum.request({
           method: 'eth_call', //eth_call tx per cui non serve pagare e vedi i dati //eth_sendtx modifica lo stato della bc
           params: [{
             from: myAccountAddress,
             to: receiverAddress,
             data: f
           }]
         }).then(async (res)=>{

          const result = web3.eth.abi.decodeParameter('address[]', res);

          console.log(result)
          console.log(result.length)

          for (let i = 0; i < result.length; i++) {
            const key = result[i];
            const value = await contract.methods.getStudent(key).call();
            console.log(`Key: ${key}, Value: ${value}`);
          }

         }).catch((error)=>{
           console.log(error)
         })
       })
}

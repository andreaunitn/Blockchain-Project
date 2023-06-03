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

  fetch('http://localhost:3000/contracts/MyContract.json', {
       method: 'GET',
       headers: {
           'Accept': 'application/json',
       },
   })
       .then(response => response.json())
       .then(response => {
         var bytecode = response.bytecode

         let encodedArguments =web3.eth.abi.encodeParameter('string', 'cancher').substring(2);

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

async function deployPeopleCollector() {
  fetch('http://localhost:3000/contracts/IterableMapping.json', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
    .then(response => response.json())
    .then(response => {

      var bytecode = response.bytecode;

      ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: myAccountAddress,
          data: bytecode.toString('hex'),
        }]
      }).then((transactionHash) => {
        console.log(transactionHash);
        web3.eth.getTransactionReceipt(transactionHash).then((receipt) => {
          if (receipt && receipt.contractAddress) {
            receiverAddress = receipt.contractAddress;
            console.log("Contract deployed at address:", receiverAddress);
          }
        });
      }).catch((error) => {
        console.log(error);
      });
    });
}


async function applyForScholarship() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.enable(); // Request user's permission to access their accounts
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
      console.error('No accounts found');
      return;
    }
    const userAddress = accounts[0]; // Get the user's address from MetaMask

    const name = document.getElementById('name').value; // Retrieve name from form
    const isee = parseInt(document.getElementById('isee').value); // Retrieve isee value from form

    fetch('http://localhost:3000/contracts/PeopleCollector.json', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        const abi = response.abi;
        const contract = new web3.eth.Contract(abi, receiverAddress);

        const f = contract.methods.setUser(userAddress, name, isee).encodeABI(); // Call setUser() with the provided values

        ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: myAccountAddress,
            to: receiverAddress,
            data: f
          }]
        }).then((res) => {
          const result = web3.eth.abi.decodeParameter('uint', res);
          console.log(result);
        }).catch((error) => {
          console.log(error);
        });
      });
  } else {
    console.error('MetaMask is not installed');
  }
}

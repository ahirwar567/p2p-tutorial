const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_sessionId",
				"type": "uint256"
			}
		],
		"name": "completeSession",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tutor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "createSession",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_sessionId",
				"type": "uint256"
			}
		],
		"name": "makePayment",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sessionId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentMade",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_rating",
				"type": "uint256"
			}
		],
		"name": "rateUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newRating",
				"type": "uint256"
			}
		],
		"name": "RatingUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "enum P2PTutoringPlatform.UserType",
				"name": "_userType",
				"type": "uint8"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sessionId",
				"type": "uint256"
			}
		],
		"name": "SessionCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sessionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tutor",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "student",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "SessionCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum P2PTutoringPlatform.UserType",
				"name": "userType",
				"type": "uint8"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "sessionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sessions",
		"outputs": [
			{
				"internalType": "address",
				"name": "tutor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "student",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "paid",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "enum P2PTutoringPlatform.UserType",
				"name": "userType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "rating",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sessionsCompleted",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0xB8a7424530F619C80bE4475Ed5d377441b7A75Aa';

let web3;
let contract;
let accounts;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            accounts = await web3.eth.getAccounts();
            contract = new web3.eth.Contract(contractABI, contractAddress);
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
}

async function registerUser() {
    const userType = document.getElementById('user-type').value;
    await contract.methods.registerUser(userType).send({ from: accounts[0] });
    alert('User registered successfully!');
}

async function createSession() {
    const tutorAddress = document.getElementById('tutor-address').value;
    const sessionPrice = document.getElementById('session-price').value;
    await contract.methods.createSession(tutorAddress, sessionPrice).send({ from: accounts[0] });
    alert('Session created successfully!');
}

async function completeSession() {
    const sessionId = document.getElementById('session-id').value;
    await contract.methods.completeSession(sessionId).send({ from: accounts[0] });
    alert('Session completed successfully!');
}

async function makePayment() {
    const sessionId = document.getElementById('payment-session-id').value;
    const session = await contract.methods.sessions(sessionId).call();
    const price = session.price;
    await contract.methods.makePayment(sessionId).send({ from: accounts[0], value: price });
    alert('Payment made successfully!');
}

async function rateUser() {
    const userAddress = document.getElementById('rate-user-address').value;
    const rating = document.getElementById('rating').value;
    await contract.methods.rateUser(userAddress, rating).send({ from: accounts[0] });
    alert('User rated successfully!');
}

window.addEventListener('load', init);

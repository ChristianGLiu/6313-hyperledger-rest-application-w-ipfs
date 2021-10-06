// SPDX-License-Identifier: UNLICENSED
// Author: Christian Gang Liu
// Date: 2021-01-31

// 'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
// const $ = jQuery = require('jquery')

const CAUtil = require('./lib/CAUtil.js');
const AppUtil = require('./lib/AppUtil.js');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./lib/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./lib/AppUtil.js');


// const channelName = 'mychannel';
// const chaincodeName = 'basic';
// const mspOrg1 = 'Org1MSP';
// const walletPath = path.join(__dirname, 'wallet');
// const org1UserId = 'appUser';
const caname = 'actorfsmmodelca'
const orgname = 'Org1MSP'
const actorname = 'mainchainonly'
const adminname = 'admin'
const admindisplayname = 'actorfsmmodel Admin'
const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';

const walletPath = path.join(__dirname, 'actorfsmmodel');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const org1UserId = 'appUser';

// http server config
const http = require("http");
const url = require('url');


const host = '0.0.0.0';
const port = 8000;

let completeProfile = '';

// $.get("http://noodlenami.com:8080/ak/api/v1/components").done(function (contents) {
// 	console.log("buildJunglekidsOrg1 from profile:", JSON.stringify(contents, null, 4))
// 	completeProfile = JSON.parse(contents);
// });

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 *
 * curl http://console.127.0.0.1.nip.io:8080/ak/api/v1/components
curl http://console.127.0.0.1.nip.io:8080/ak/api/v1/components | jq '.[] | select(.type == "gateway")'
curl http://noodlenami.com:28080/ak/api/v1/components | jq '.[] | select(.type == "identity")'

 */

let identity = 'actorfsmmodel Admin'
let networkConnections = {}
let gateway = null
let network = null
let contract = null

async function initializeHyperledgerNetowrk() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = AppUtil.buildJunglekidsOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		// const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);
		if (gateway == null)
			gateway = new Gateway();

		if (network == null) {

			console.log("Build a network instance")
			await gateway.connect(ccp, {
				wallet,
				identity: identity,
				// clientTlsIdentity:'actorfsmmodeladmin',
				// tlsInfo: {
				// 	certificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUI0RENDQVlhZ0F3SUJBZ0lRT1BVMG4yZWNzZEtWeUJ6K2M3b1NvekFLQmdncWhrak9QUVFEQWpBYk1Sa3cKRndZRFZRUURFeEJoWTNSdmNtWnpiVzF2WkdWc0lFTkJNQjRYRFRJeE1EY3hPREUwTURnd04xb1hEVE14TURjeApOakUwTURnd04xb3dMakVPTUF3R0ExVUVDeE1GWVdSdGFXNHhIREFhQmdOVkJBTVRFMkZqZEc5eVpuTnRiVzlrClpXd2dRV1J0YVc0d1dUQVRCZ2NxaGtqT1BRSUJCZ2dxaGtqT1BRTUJCd05DQUFRNTYzaWgrMHN0dUlMUzVMWDQKY0VWWERhSnM5a2JQYUgrYTdPeWMvMEhYREtOZWpuMEFmeDA4SkcvaG4xanliRjIyK3Q5Wmd4LzBYZ1JsZ3RBQwpUZzFDbzRHWU1JR1ZNQTRHQTFVZER3RUIvd1FFQXdJRm9EQWRCZ05WSFNVRUZqQVVCZ2dyQmdFRkJRY0RBZ1lJCkt3WUJCUVVIQXdFd0RBWURWUjBUQVFIL0JBSXdBREFwQmdOVkhRNEVJZ1FnalViWnVmSS82SlJkWDFKUDdKMEYKMkk0cm5ZU0JMbjlpaGI2cjN1dURDMUV3S3dZRFZSMGpCQ1F3SW9BZ25aaERTK1B3czNvQXB5RmFyVzc2eXdiNwozRTBYb2RtNVExcjhaeng5eGRjd0NnWUlLb1pJemowRUF3SURTQUF3UlFJaEFPdUNTSjhTSFA3UFJWSU9sc2RxCnZRNWVwdklxYllSbUhmMURWRzU4NkYxQ0FpQUU0QmxhcVhTdEZPRU1WRHFzSmxoRzQ1aGRuL0F2MGI2SVlRNVYKU0JCQ2Z3PT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",

				// 	key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR0hBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJHMHdhd0lCQVFRZ3FXUmphNGgyd3FveWxYYmYKUC9WZHNycHY0RHE0SWVZaWYveThOZ3FnZFVHaFJBTkNBQVE1NjNpaCswc3R1SUxTNUxYNGNFVlhEYUpzOWtiUAphSCthN095Yy8wSFhES05lam4wQWZ4MDhKRy9objFqeWJGMjIrdDlaZ3gvMFhnUmxndEFDVGcxQwotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg==",

				// },
				discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

		}

	} catch (error) {
		console.error(`******** getHyperledgerGateway: ${error}`);
	}
}

async function initializeHyperledgerContract(actorname) {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		// const ccp = AppUtil.buildJunglekidsOrg1();

		// Build a network instance based on the channel where the smart contract is deployed
		console.log("Build a network instance based on the channel where the smart contract is deployed")
		network = await gateway.getNetwork(actorname);

		// Get the contract from the network.
		console.log("Get the contract from the network.", network)
		contract = network.getContract(actorname);

		console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
		await contract.submitTransaction('InitLedger', actorname);
		console.log('*** Result: committed');

		networkConnections[actorname] = contract;
		return contract;
	} catch (error) {
		console.error(`******** getHyperledgerGateway: ${error}`);
	}
}

function shutdownHyperledgerContract(actorname) {
	// this.gateway.disconnect();
	networkConnections[actorname] = null;
}

async function getActorConnection(actor) {
	if (!networkConnections[actor]) {
		await initializeHyperledgerContract(actor)
	}
	return networkConnections[actor]
	// return	await initializeHyperledgerContract(actor)
	// return contract
}

async function deleteAsset(actor, id) {
	console.log('\n--> Evaluate Transaction: DeleteAsset, function returns "true" if an asset with given assetID exist');
	let contract = await getActorConnection(actor)

	let result = await contract.submitTransaction('DeleteAsset', id);
	console.log(`*** Result: ${prettyJSONString(result.toString())}`);
	return result;
}

async function createOrUpdateGloableAsset(actor, id, newstate) {
	console.log('\n--> Submit Transaction:     async CreateOrUpdateGloableAsset(ctx, txid, activestate) {					');
	let contract = await getActorConnection(actor)

	let result = await contract.submitTransaction('CreateOrUpdateGloableAsset', id, newstate);
	console.log('*** Result: CreateOrUpdateGloableAsset');
	if (`${result}` !== '') {
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
	}
	return result;
}

async function getAllAssets(actor) {
	console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
	let contract = await getActorConnection(actor)
	console.log('get ' + actor + ' contract', contract)
	let result = await contract.evaluateTransaction('GetAllAssets');
	return result;
}

async function readAsset(actor, id) {
	console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
	let contract = await getActorConnection(actor)
	let result = await contract.evaluateTransaction('ReadAsset', id);
	console.log(`*** Result: ${prettyJSONString(result.toString())}`);
	return result;
}

const requestListener = async function (req, res) {

	const queryObject = url.parse(req.url, true).query;
	if (!queryObject || !queryObject.username || !queryObject.password) {
		res.writeHead(400);
		res.end('{error: no username or passowrd}');
		return;
	}
	if (queryObject.username != adminUserId || queryObject.password != adminUserPasswd) {
		res.writeHead(400);
		res.end('{error: username or passowrd is not correct.}');
		return;
	}
	if (!queryObject.actor) {
		res.writeHead(400);
		res.end('{error: actor is not specified.}');
		return;
	}

	console.log("req.url:", req.url)

	let result = ''
	let id = ''
	let txid = ''
	let newstate = ''
	let actor = queryObject.actor
	res.setHeader("Content-Type", "application/json");

	if (req.url.startsWith("/read")) {
		id = queryObject.id
		result = await readAsset(actor, id)
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith("/update")) {
		newstate = queryObject.newstate
		txid = queryObject.txid
		result = await createOrUpdateGloableAsset(actor, txid, newstate)
		res.writeHead(200);
		res.end(result);

	} else if (req.url.startsWith("/delete")) {
		id = queryObject.id
		result = await deleteAsset(actor, id)
		res.writeHead(200);
		res.end(result);

	}else {
		res.writeHead(200);
		result = await getAllAssets(actor)
		res.end(result);
	}

};

const server = http.createServer(requestListener);
server.listen(port, host, async () => {

	await initializeHyperledgerNetowrk();
	await initializeHyperledgerContract('seller')
	await initializeHyperledgerContract('buyer')
	await initializeHyperledgerContract('shippingcompany')
	await initializeHyperledgerContract('partial')
	await initializeHyperledgerContract('mainchainonly')
	console.log(`Server is running on http://${host}:${port}`);
});

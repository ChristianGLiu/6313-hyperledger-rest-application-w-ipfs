// SPDX-License-Identifier: UNLICENSED
// Author: Christian Gang Liu
// Date: 2021-01-31

// 'use strict';

import { Gateway, Wallets } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import path from 'path';
// import $, { jQuery } from 'jquery';

// import CAUtil from './lib/CAUtil.js';
import AppUtil from './lib/AppUtil.js';
// import { buildCAClient, registerAndEnrollUser, enrollAdmin } from './lib/CAUtil.js';
const { buildCCPOrg1, buildWallet } = AppUtil;

import { create } from 'ipfs-http-client';
// connect to the default API address http://localhost:5001
const client = create();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { AbortController } from "node-abort-controller";

global.AbortController = AbortController;

var MFS_path = '/files_this_is_a_purchase_document';
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

const walletPath = path.join(__dirname, 'Org1');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const org1UserId = 'appUser';

// http server config
// const http = require("http");
// const url = require('url');
import http from "http";
import url from 'url';


const host = '0.0.0.0';
const port = 8952;

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

let identity = 'Org1 Admin'
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

async function initializeHyperledgerContract() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		// const ccp = AppUtil.buildJunglekidsOrg1();

		// Build a network instance based on the channel where the smart contract is deployed
		console.log("Build a network instance based on the channel where the smart contract is deployed")
		network = await gateway.getNetwork('channel1');

		// Get the contract from the network.
		console.log("Get the contract from the network.", network)
		contract = network.getContract('nonPrivateData');

		// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
		// await contract.submitTransaction('InitLedger', 'nonPrivateData');
		// console.log('*** Result: committed');

		networkConnections['nonPrivateData'] = contract;
		return contract;
	} catch (error) {
		console.error(`******** getHyperledgerGateway: ${error}`);
	}
}

async function getActorConnection() {
	if (!networkConnections['nonPrivateData']) {
		await initializeHyperledgerContract()
	}
	return networkConnections['nonPrivateData']
}

//"This is a new purchase document!"
async function createAsset(id, value) {
	let result;
	client.files.write(MFS_path,
		new TextEncoder().encode(value),
		{ create: true }).then(async r => {

			client.files.stat(MFS_path, { hash: true }).then(async r => {
				let ipfsAddr = r.cid.toString();
				console.log("added file ipfs:", ipfsAddr)
				// console.log("created message on IPFS:", cid);
				let contract = await getActorConnection()
				result = await contract.submitTransaction('createMyAsset', id, ipfsAddr);
				// console.log(content.toString());
			});
		}).catch(e => {
			console.log(e);
		});

	return result;
}

async function updateAsset(id, value) {
	// students need to complete this function ..
}

async function readAsset(id) {
	console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
	let contract = await getActorConnection()
	let result = await contract.evaluateTransaction('readMyAsset', id);
	let resultValue = JSON.parse(result.toString()).value;
	console.log(`*** Result: ${resultValue}`);
	const resp = await client.cat(resultValue);
	let content = [];
	for await (const chunk of resp) {
		content = [...content, ...chunk];
		const raw = Buffer.from(content).toString('utf8')
		// console.log(JSON.parse(raw))
		console.log(raw)
	}
	return Buffer.from(content).toString('utf8');
}

async function deleteAsset(id) {
	console.log('\n--> Evaluate Transaction: DeleteAsset, function returns "true" if an asset with given assetID exist');
	let contract = await getActorConnection()
	let result = await contract.submitTransaction('deleteMyAsset', id);
	console.log(`*** Result: ${result}`);
	return result;
}

async function getAllAssets() {
	console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
	let contract = await getActorConnection()
	let result = await contract.evaluateTransaction('GetAllAssets');
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

	console.log("req.url:", req.url)

	let result = ''
	let id = ''
	let txid = ''
	let newstate = ''
	let actor = queryObject.actor
	let ipfs = ''
	res.setHeader("Content-Type", "application/json");

	if (req.url.startsWith("/read")) {
		txid = queryObject.txid
		result = await readAsset(txid)
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith("/update")) {
		newstate = queryObject.newstate
		txid = queryObject.txid
		result = await updateAsset(txid, newstate)
		res.writeHead(200);
		res.end(result);

	} else if (req.url.startsWith("/create")) {
		newstate = queryObject.newstate
		txid = queryObject.txid
		result = await createAsset(txid, newstate)
		res.writeHead(200);
		res.end(result);

	} else if (req.url.startsWith("/delete")) {
		txid = queryObject.txid
		result = await deleteAsset(txid)
		res.writeHead(200);
		res.end(result);

	} else {
		res.writeHead(200);
		result = await getAllAssets()
		res.end(result);
	}

};

const server = http.createServer(requestListener);
server.listen(port, host, async () => {

	await initializeHyperledgerNetowrk();
	console.log(`Server is running on http://${host}:${port}`);
});

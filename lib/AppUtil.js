/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// const $ = require('jquery')
// const path = require('path')
// const fs = require('fs')

import $ from 'jquery';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function buildJunglekidsOrg1  ()  {
	// load the common connection configuration file
	const ccpPath = path.resolve(__dirname, '..', 'LocalOrg1GatewayConnection.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	var contents = fs.readFileSync(ccpPath, 'utf8');
	var ccp = JSON.parse(contents);
	console.log(`Loaded the network configuration located at ${ccpPath}`);

	return ccp;
}

function buildCCPOrg1 () {
	// load the common connection configuration file
	const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
}

// exports.buildCCPOrg1 = () => buildCCPOrg1;

// exports.buildCCPOrg2 = () => {
// 	// load the common connection configuration file
// 	const ccpPath = path.resolve(__dirname, '..', '..', 'test-network',
// 		'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
// 	const fileExists = fs.existsSync(ccpPath);
// 	if (!fileExists) {
// 		throw new Error(`no such file or directory: ${ccpPath}`);
// 	}
// 	const contents = fs.readFileSync(ccpPath, 'utf8');

// 	// build a JSON object from the file contents
// 	const ccp = JSON.parse(contents);

// 	console.log(`Loaded the network configuration located at ${ccpPath}`);
// 	return ccp;
// };

async function buildWallet (Wallets, walletPath)  {
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet;
	if (walletPath) {
		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log('Built an in memory wallet');
	}

	return wallet;
}

// exports.buildWallet = buildWallet;

// exports.prettyJSONString = (inputString) => {
// 	if (inputString) {
// 		return JSON.stringify(JSON.parse(inputString), null, 2);
// 	}
// 	else {
// 		return inputString;
// 	}
// }

export default { buildCCPOrg1, buildJunglekidsOrg1, buildWallet };

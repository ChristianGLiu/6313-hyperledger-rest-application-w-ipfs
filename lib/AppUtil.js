/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const $ = require('jquery')
const path = require('path')
const fs = require('fs')

exports.buildJunglekidsOrg1 = () => {
	// load the common connection configuration file
	const ccpPath = path.resolve(__dirname, '..', 'ActormodelActorfsmmodelGatewayConnection.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	var contents = fs.readFileSync(ccpPath, 'utf8');
	// console.log(`contentst ${contents}`);

	// var ccp =null
	var ccp = JSON.parse(contents);
	// $.get('../junglekidshyperledgerprofile.json').done(function (diagram) {
	// 	// console.log('diagram:', diagram)
	// 	ccp = JSON.parse(diagram);
	// 	// convertedText('abstractActor', convertedText)
	// 	// smartContracteditor.contents(convertedText);
	// });

	// build a JSON object from the file contents


	console.log(`Loaded the network configuration located at ${ccpPath}`);

	// $.get("http://noodlenami.com:8080/ak/api/v1/components").done(function (contents) {
    //     console.log("buildJunglekidsOrg1 from profile:", JSON.stringify(contents,null,4))
    //     // ccp = JSON.parse(contents);
    // });

	return ccp;
};

exports.buildCCPOrg1 = () => {
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
};

exports.buildCCPOrg2 = () => {
	// load the common connection configuration file
	const ccpPath = path.resolve(__dirname, '..', '..', 'test-network',
		'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
	const fileExists = fs.existsSync(ccpPath);
	if (!fileExists) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const contents = fs.readFileSync(ccpPath, 'utf8');

	// build a JSON object from the file contents
	const ccp = JSON.parse(contents);

	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
};

exports.buildWallet = async (Wallets, walletPath) => {
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
};

exports.prettyJSONString = (inputString) => {
	if (inputString) {
		return JSON.stringify(JSON.parse(inputString), null, 2);
	}
	else {
		return inputString;
	}
}

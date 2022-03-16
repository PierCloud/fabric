var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const {Gateway, Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');
//const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
//      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));


app.get('/api/queryallcars', async function (req, res) {

    const userAgent = req.header("User-Agent");
    const origin = req.header("Origin");

    // if (userAgent === undefined || origin === undefined)
    //     res.status(401).json({message: 'Unauthorized'});
    let callMessage = "[CallCheck] query all cars called by: " + userAgent + "with origin :" + origin;
    let callInfo = {
        message: callMessage,
        userAgent: userAgent,
        origin: origin
    }
    console.info(callInfo);
    if (req.query.apiKey === 'a632fe2b-fd69-4404-b960-beb0ca25fa40') {
        try {
            // const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccpPath = path.resolve(__dirname, 'connection-org1.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {wallet, identity: 'appUser', discovery: {enabled: true, asLocalhost: true}});

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('fabcar');

            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.evaluateTransaction('queryAllCars');
            console.log(JSON.parse(result)[0]["Record"]);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            res.status(200).json({response: result.toString()});
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({error: error});
            process.exit(1);
        }
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
});


app.get('/api/query/:car_index', async function (req, res) {
    if (req.query.apiKey == 'a632fe2b-fd69-4404-b960-beb0ca25fa40') {

        try {
            // const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccpPath = path.resolve(__dirname, 'connection-org1.json');

            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {wallet, identity: 'appUser', discovery: {enabled: true, asLocalhost: true}});

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('fabcar');
// Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.evaluateTransaction('queryCar', req.params.car_index);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            res.status(200).json({response: result.toString()});
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json({error: error});
            process.exit(1);
        }
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
});

app.get('/api/test', async function (req, res) {
    if (req.query.apiKey == 'a632fe2b-fd69-4404-b960-beb0ca25fa40') {

        try {
            let result = "ok let's go";
            console.log('ookkk')
            res.status(200).json({response: result.toString()});
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            res.status(500).json(body={error: error});
            process.exit(1);
        }
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
});
app.post('/api/testpost/', async function (req, res) {
    console.log("chiamato con req ")
    console.log(req.params)
    console.log(req.query)
    console.log("body")
    console.log(req.body)
    res.send('Transaction has been submitted');
})

app.post('/api/addcar/', async function (req, res) {
    if (req.body.apiKey == 'a632fe2b-fd69-4404-b960-beb0ca25fa40') {

        try {
            // const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccpPath = path.resolve(__dirname, 'connection-org1.json');

            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {wallet, identity: 'appUser', discovery: {enabled: true, asLocalhost: true}});

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('fabcar');
// Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
            await contract.submitTransaction('createCar', req.body.carid, req.body.make, req.body.model, req.body.colour, req.body.owner);
            console.log('Transaction has been submitted');
            res.send('Transaction has been submitted');
// Disconnect from the gateway.
            await gateway.disconnect();
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
})


app.put('/api/changeowner/:car_index', async function (req, res) {
    let body;
    if (req.body.apiKey == 'a632fe2b-fd69-4404-b960-beb0ca25fa40') {

        try {
            // const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccpPath = path.resolve(__dirname, 'connection-org1.json');

            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {wallet, identity: 'appUser', discovery: {enabled: true, asLocalhost: true}});

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('fabcar');
// Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
            await contract.submitTransaction('changeCarOwner', req.params.car_index, req.body.owner);
            console.log('Transaction has been submitted');
            res.send('Transaction has been submitted');
// Disconnect from the gateway.
            await gateway.disconnect();
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    } else {
        res.status(401).json( {message: 'Unauthorized'});
    }
})

app.listen(8080, "localhost");

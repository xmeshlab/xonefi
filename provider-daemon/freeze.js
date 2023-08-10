const callFreeze = () => {
    const { workerData } = require('worker_threads');
    const Web3 = require('web3');

    console.log('XLOG: Data from main thread:', workerData);
    // let counter = 0;
    // while (counter < 9000000000) {
    //     counter++;
    // }
    // console.log('XLOG: finish complex test calculation.');

    const timestamp = require("../api/timestamp");

    var web3 = new Web3("wss://" + workerData.config_json_new.network + ".infura.io/ws/v3/" + workerData.config_json_new.infura_api_key);

    var myContract = new web3.eth.Contract(workerData.contract_config_json.contract_abi, workerData.contract_config_json.smart_contract);

    var account = web3.eth.accounts.privateKeyToAccount(workerData.decrypted_private_key);
    web3.eth.accounts.wallet.add(account);

    myContract.methods.freeze(workerData.json_object.command.arguments.pafren.client,
        workerData.json_object.command.arguments.pafren.amount.toString(),
        workerData.json_object.command.arguments.pafren.timestamp,
        //web3.utils.hexToBytes(json_object.command.arguments.pafren.proof))
        workerData.json_object.command.arguments.pafren.proof)
        .send({from: account.address, gas: workerData.gas_offer, gasPrice: workerData.gas_price})
        .on('transactionHash', function (hash) {
            console.log("TNX HASH IS READY: " + hash);

            if (workerData.session_statuses.get(workerData.json_object.command.session) === workerData.session_status.HANDSHAKE) {
                workerData.response.command.arguments.answer = "PAFREN-OK";
                workerData.session_pafren_expirations.set(workerData.json_object.command.session, workerData.json_object.command.arguments.pafren.timestamp);
                var signature_json = web3.eth.accounts.sign(
                    JSON.stringify(workerData.response.command),
                    workerData.decrypted_private_key
                );

                workerData.response.signature = signature_json.signature;
                workerData.session_statuses.set(workerData.json_object.command.session, workerData.session_status.ACTIVE);
                workerData.session_handshake_deadlines.set(workerData.json_object.command.session, 0);
                workerData.session_pafren_expirations.set(workerData.json_object.command.session, workerData.json_object.command.arguments.pafren.timestamp);
                workerData.session_sack_deadlines.set(workerData.json_object.command.session, timestamp.get_current_timestamp() + workerData.config_json_new.sack_period);

                // console.log("JSON.stringify(workerData.response): " + JSON.stringify(workerData.response));
                // console.log("Remote.port: " + remote.port);
                // console.log("Remote.address: " + remote.address);
                //
                // workerData.onefi_server.send(new Buffer(JSON.stringify(workerData.response)), remote.port, remote.address, function (err, bytes) {
                //     if (err) throw err;
                //     console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
                // });
            }
        })
        // .on('confirmation', function (confirmationNumber, receipt) {
        //     console.log("CONF. #: " + confirmationNumber);
        //     if (confirmationNumber >= workerData.config_json_new.call_confirmation_threshold
        //         && workerData.session_statuses.get(workerData.json_object.command.session) === workerData.session_status.HANDSHAKE) {
        //         console.log("CONFIRMATION IS READY. CONFIRMATION NUMBER: " + confirmationNumber);
        //         console.log("CONFIRMATION PRELIMINARY RECEIPT: " + JSON.stringify(receipt));
        //         return;
        //     } else {
        //         return;
        //     }
        // })
        // .on('receipt', function (receipt) {
        //     console.log("RECEIPT IS READY: " + JSON.stringify(receipt_json));
        //     console.log("session_statuses.get(workerData.json_object.command.session): " + workerData.session_statuses.get(workerData.json_object.command.session));

        //     if (receipt.status === true) {
        //         workerData.response.command.arguments.answer = "PAFREN-OK";
        //         //session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);

        //         var signature_json = web3.eth.accounts.sign(
        //             JSON.stringify(workerData.response.command),
        //             workerData.decrypted_private_key
        //         );

        //         workerData.response.signature = signature_json.signature;
        //         workerData.session_statuses.set(workerData.json_object.command.session, session_status.ACTIVE);
        //         workerData.session_handshake_deadlines.set(workerData.json_object.command.session, 0);
        //         workerData.session_pafren_expirations.set(workerData.json_object.command.session, json_object.command.arguments.pafren.timestamp);

        //         console.log("JSON.stringify(workerData.response): " + JSON.stringify(workerData.response));
        //         console.log("Remote.port: " + remote.port);
        //         console.log("Remote.address: " + remote.address);

        //         this.send(new Buffer(JSON.stringify(workerData.response)), remote.port, remote.address, function (err, bytes) {
        //             if (err) throw err;
        //             console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
        //             return;
        //         });
        //         return;
        //     } else {
        //         workerData.response.command.arguments.answer = "PAFREN-FAIL";
        //         workerData.session_statuses.set(workerData.json_object.command.session, session_status.CLOSED);
        //         workerData.session_handshake_deadlines.set(workerData.json_object.command.session, 0);
        //         workerData.session_pafren_expirations.set(workerData.json_object.command.session, 0);

        //         var signature_json = web3.eth.accounts.sign(
        //             JSON.stringify(workerData.response.command),
        //             workerData.decrypted_private_key
        //         );

        //         workerData.response.signature = signature_json.signature;

        //         this.send(new Buffer(JSON.stringify(workerData.response)), remote.port, remote.address, function (err, bytes) {
        //             if (err) throw err;
        //             console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
        //             return;
        //         });
        //         return;
        //     }
        // })
        .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log(`NEW ERROR: ${error}`);
        console.log(`NEW RECEIPT: ${receipt}`);
        return;
    });
}

console.log("[55]: DEBUG: Calling freeze.");
callFreeze();
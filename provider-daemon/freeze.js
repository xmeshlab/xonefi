const callFreeze = () => {
    const { workerData } = require('worker_threads');

    console.log('XLOG: Data from main thread:', workerData);
    // let counter = 0;
    // while (counter < 9000000000) {
    //     counter++;
    // }
    // console.log('XLOG: finish complex test calculation.');


    workerData.myContract.methods.freeze(workerData.json_object.command.arguments.pafren.client,
        workerData.json_object.command.arguments.pafren.amount.toString(),
        workerData.json_object.command.arguments.pafren.timestamp,
        //web3.utils.hexToBytes(json_object.command.arguments.pafren.proof))
        workerData.json_object.command.arguments.pafren.proof)
        .send({from: workerData.account.address, gas: workerData.gas_offer, gasPrice: workerData.gas_price})
        .on('transactionHash', function (hash) {
            console.log("TNX HASH IS READY: " + hash);

            if (workerData.session_statuses.get(workerData.json_object.command.session) === workerData.session_status.HANDSHAKE) {
                response.command.arguments.answer = "PAFREN-OK";
                workerData.session_pafren_expirations.set(workerData.json_object.command.session, workerData.json_object.command.arguments.pafren.timestamp);
                var signature_json = web3.eth.accounts.sign(
                    JSON.stringify(response.command),
                    workerData.decrypted_private_key
                );

                response.signature = signature_json.signature;
                workerData.session_statuses.set(json_object.command.session, session_status.ACTIVE);
                workerData.session_handshake_deadlines.set(json_object.command.session, 0);
                workerData.session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);
                workerData.session_sack_deadlines.set(json_object.command.session, timestamp.get_current_timestamp() + config_json_new.sack_period);

                console.log("JSON.stringify(response): " + JSON.stringify(response));
                console.log("Remote.port: " + remote.port);
                console.log("Remote.address: " + remote.address);

                workerData.onefi_server.send(new Buffer(JSON.stringify(response)), remote.port, remote.address, function (err, bytes) {
                    if (err) throw err;
                    console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
                });
            }
        }).on('confirmation', function (confirmationNumber, receipt) {
            console.log("CONF. #: " + confirmationNumber);
            if (confirmationNumber >= workerData.config_json_new.call_confirmation_threshold
                && workerData.session_statuses.get(workerData.json_object.command.session) === workerData.session_status.HANDSHAKE) {
                console.log("CONFIRMATION IS READY. CONFIRMATION NUMBER: " + confirmationNumber);
                console.log("CONFIRMATION PRELIMINARY RECEIPT: " + JSON.stringify(receipt));
            }
        }).on('receipt', function (receipt) {
            console.log("RECEIPT IS READY: " + JSON.stringify(receipt_json));
            console.log("session_statuses.get(json_object.command.session): " + workerData.session_statuses.get(workerData.json_object.command.session));

            if (receipt.status === true) {
                response.command.arguments.answer = "PAFREN-OK";
                //session_pafren_expirations.set(json_object.command.session, json_object.command.arguments.pafren.timestamp);

                var signature_json = web3.eth.accounts.sign(
                    JSON.stringify(response.command),
                    workerData.decrypted_private_key
                );

                response.signature = signature_json.signature;
                workerData.session_statuses.set(json_object.command.session, session_status.ACTIVE);
                workerData.session_handshake_deadlines.set(workerData.json_object.command.session, 0);
                workerData.session_pafren_expirations.set(workerData.json_object.command.session, json_object.command.arguments.pafren.timestamp);

                console.log("JSON.stringify(response): " + JSON.stringify(response));
                console.log("Remote.port: " + remote.port);
                console.log("Remote.address: " + remote.address);

                this.send(new Buffer(JSON.stringify(response)), remote.port, remote.address, function (err, bytes) {
                    if (err) throw err;
                    console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
                });
            } else {
                response.command.arguments.answer = "PAFREN-FAIL";
                workerData.session_statuses.set(workerData.json_object.command.session, session_status.CLOSED);
                workerData.session_handshake_deadlines.set(workerData.json_object.command.session, 0);
                workerData.session_pafren_expirations.set(workerData.json_object.command.session, 0);

                var signature_json = web3.eth.accounts.sign(
                    JSON.stringify(response.command),
                    workerData.decrypted_private_key
                );

                response.signature = signature_json.signature;

                this.send(new Buffer(JSON.stringify(response)), remote.port, remote.address, function (err, bytes) {
                    if (err) throw err;
                    console.log(`Answer has been sent to ${remote.address}:${remote.port}`);
                });
            }
        }).on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log(`NEW ERROR: ${error}`);
        console.log(`NEW RECEIPT: ${receipt}`);
    });
}

callFreeze();
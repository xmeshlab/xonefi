const callFreeze = () => {
    const { workerData } = require('worker_threads');

    console.log('XLOG: Data from main thread:', workerData);
    console.log(`XLOG: start complex test calculation: ${data}`);
    let counter = 0;
    while (counter < 9000000000) {
        counter++;
    }
    console.log('XLOG: finish complex test calculation.');
}

callFreeze();
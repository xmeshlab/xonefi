const complexCalc = () => {
    console.log('XLOG: start complex test calculation.');
    let counter = 0;
    while (counter < 900000000000) {
        counter++;
    }
    console.log('XLOG: finish complex test calculation.');
}

complexCalc();
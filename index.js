const { createWallet, walletTxt } = require('./wallet');
const { claim } = require('./avt');
const fs = require('fs');
const prompt = require('prompt-sync')();

const option1 = async () => {
    const wallet = await createWallet();
    await claim(wallet, true);
    return 0;
}

const option2 = async () => {
    const wallet = await createWallet();
    await claim(wallet);
    return 0;
}

const option3 = async () => {
    const fileData = fs.readFileSync('wallet.json', (err) => {
        if(err){
            console.log('wallet not found!')
            return 0;
        }
    })
    const wallet = JSON.parse(fileData);
    await claim(wallet, true);
    return 0;
}

const option4 = async () => {
    const fileData = fs.readFileSync('wallet.json', (err) => {
        if(err){
            console.log('wallet not found!')
            return 0;
        }
    })
    const wallet = JSON.parse(fileData);
    await claim(wallet);
    return 0;
}

const option5 = async () => {
    await walletTxt();
    return 0;
}

const mulai = async () => {
    let ulang = true;
    while(ulang){
        process.stdout.write('\033c');
        console.log('1. Create 10 wallet and claim with proxy\n2. Create 10 wallet and claim without proxy (manual)\n3. Claim faucet with address in wallet.json\n4. Claim faucet with address in wallet.json without proxy (manual)\n5. Wallet.json to wallet.txt');
        let pilihan = prompt('Masukan pilihan mu (1-5): ');
    
        if(pilihan === '1' || pilihan === 1){
            process.stdout.write('\033c');
            await option1();
        } if(pilihan === '2' || pilihan === 2){
            process.stdout.write('\033c');
            await option2();
        } else if(pilihan === '3' || pilihan === 3){
            process.stdout.write('\033c');
            await option3()
        } else if(pilihan === '4' || pilihan === 4){
            process.stdout.write('\033c');
            await option4()
        } else if(pilihan === '5' || pilihan === 5){
            process.stdout.write('\033c');
            await option5()
        } else {
            console.log('Sing jelas bro');
            process.exit();
        }
        pilihan = prompt('Lanjut? (y/n): ');
        pilihan.toLocaleLowerCase();
        if(pilihan === 'n' || pilihan === 'no'){
            ulang = false;
        } else if (pilihan === 'y' || pilihan === 'ya'){
            continue;
        } else {
            console.log('Sing jelas bro');
            process.exit();
        }
    }
    process.exit();
}

mulai()
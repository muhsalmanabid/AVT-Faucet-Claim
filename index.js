const { createWallet } = require('./wallet');
const { claim } = require('./avt');
const fs = require('fs');
const prompt = require('prompt-sync')();

const option1 = async () => {
    const wallet = await createWallet();
    await claim(wallet);
    return 0;
}

const option2 = async () => {
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

const mulai = async () => {
    let ulang = true;
    while(ulang){
        process.stdout.write('\033c');
        console.log('1. Create 10 wallet and claim\n2. Claim faucet with address in wallet.json\n');
        let pilihan = prompt('Masukan pilihan mu (1 atau 2): ');
    
        if(pilihan === '1' || pilihan === 1){
            await option1();
        } else if(pilihan === '2' || pilihan === 2){
            await option2()
        } else {
            console.log('Sing jelas bro');
            process.exit();
        }
        // switch(pilihan){
        //     case 1:
        //     case '1':
        //         await option1();
        //         break;
        //     case 2:
        //     case '2':
        //         await option2();
        //         break;
        //     default:
        //     console.log('Sing jelas bro');
        //     process.exit();
        //     break;
        // }
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
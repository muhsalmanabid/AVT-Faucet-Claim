const Wallet = require('ethereumjs-wallet');
const fs = require('fs');
const prompt = require('prompt-sync')();

const createWallet = async () => {
    let walletList = [];
    console.log('start creating 10 new wallet!')
    for(let i = 0; i<10; i++){
        const EthWallet = Wallet.default.generate();
        const model = {
            address: EthWallet.getAddressString(),
            pk: EthWallet.getPrivateKeyString(),
            isAlreadyClaim: false
        }
        try {
            fs.readFileSync('wallet.json', (err) => {
            })
        } catch (err){
            console.log('wallet result file not found! creating new wallet result file...');
            fs.writeFileSync('wallet.json', JSON.stringify([model]), 'utf-8');
            console.log('success create new wallet result file!');
            continue
        }
        let fileData = fs.readFileSync('wallet.json', (err) => {
            if(err){
                console.log(err);
            }
        });
        walletList = JSON.parse(fileData);
        walletList.push(model);
        fs.writeFileSync('wallet.json', JSON.stringify(walletList, null, 0), (err) => {
            if(err){
                console.log('failed edit wallet.json')
            }
        });
    }
    console.log('success create wallet!');
    return walletList;
};

const updateWallet = async (wallet) => {
    fs.writeFileSync('wallet.json', JSON.stringify(wallet, null, 0), (err) => {
        if(err){
            console.log('failed edit wallet.json')
        }
    });
    return null;
};

const walletTxt = async () => {
    let namaFile = prompt('Masukan nama file wallet json nya (example: wallet_salman_ganteng.json): ');
    let fileData;
    try {
        fileData = await fs.readFileSync(namaFile, (err) => {
            
        })
    } catch (err) {
        console.log('ngga ketemu filenya!');
        return 0;
    }
    const waletList = JSON.parse(fileData);
    console.log('total data: ' + waletList.length)
    for(let datas of waletList){
        if(datas.isAlreadyClaim){
            console.log(datas.address);
            await fs.appendFileSync('wallet.txt', `${datas.address}\n`, 'utf-8');
            await fs.appendFileSync('address_pk.txt', `${datas.address}:${datas.pk}\n`, 'utf-8');
        }
    }
    console.log('success!');
}

module.exports = {
    createWallet,
    updateWallet,
    walletTxt
}
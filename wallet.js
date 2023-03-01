const Wallet = require('ethereumjs-wallet');
const fs = require('fs');

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
    const fileData = await fs.readFileSync('wallet.json', (err) => {
        if(err){
            console.log(err);
        }
    })
    const waletList = JSON.parse(fileData);
    console.log('total data: ' + waletList.length)
    for(let datas of waletList){
        if(datas.isAlreadyClaim){
            await fs.appendFileSync('wallet.txt', `${datas.address}\n`, 'utf-8');
        }
    }
}

module.exports = {
    createWallet,
    updateWallet,
    walletTxt
}
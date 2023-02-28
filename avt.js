const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const { updateWallet } = require('./wallet');
// const SocksAgent = require('axios-socks5-agent');
const HttpsProxyAgent = require('https-proxy-agent');
const UrlParse = require('url-parse');

const retryClaim = async (dataWallet) => {
    console.log('start retry')
    let model = {
        success: false,
        data: dataWallet
    }
    const data = qs.stringify({
        'address': dataWallet.address
    });
    const fileData = fs.readFileSync('proxy.json', (err) => {
        console.log('proxy not found!');
        return model;
    });
    const proxyList = JSON.parse(fileData);
    for(let proxy of proxyList){
        if(!model.success){
            if(!proxy.protocols[0] === 'http' || !proxy.protocols[0] === 'https' || !proxy.protocols.length || !proxy.ip || !proxy.port){
                console.log('proxy protocols or format not valid!');
            } else {
                let proxyOpts = UrlParse(`${proxy.protocols[0]}://${proxy.ip}:${proxy.port}`);
                proxyOpts.auth = `${proxy.username}:${proxy.password}`;
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://beta-faucet-service.avt.trade/airdropOpAvt',
                    headers: { 
                            'authority': 'beta-faucet-service.avt.trade', 
                            'accept': 'application/json, text/plain, */*', 
                            'accept-language': 'en-US,en;q=0.9', 
                            'content-type': 'application/x-www-form-urlencoded', 
                            'origin': 'https://beta-water.avt.trade', 
                            'referer': 'https://beta-water.avt.trade/', 
                            'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"', 
                            'sec-ch-ua-mobile': '?0', 
                            'sec-ch-ua-platform': '"Windows"', 
                            'sec-fetch-dest': 'empty', 
                            'sec-fetch-mode': 'cors', 
                            'sec-fetch-site': 'same-site', 
                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                    },
                    proxy: false,
                    httpsAgent: new HttpsProxyAgent(proxyOpts),
                    json: true,
                    data : data
                };
            
                const response = await axios(config).catch(err => {
                    if(err){
                        if(err.response){
                            if(err.response.statusText){
                                console.log(err.response.statusText);
                            } else {
                                console.log(err.response);
                            }
                        } else {
                            console.log(err);
                        }
                    }
                });
                if(typeof response === 'object' && response.data && response.data.code === 200){
                    dataWallet.isAlreadyClaim = true;
                    dataWallet.data = dataWallet.data.data;
                    model.data = dataWallet;
                    console.log(`address ${dataWallet.address} success claim! with proxy ${proxy.protocols[0]}://${proxy.ip}:${proxy.port}`)
                    break;
                } else if(typeof response === 'object' && response.data && response.data.msg === 'This address has been picked up'){
                    dataWallet.isAlreadyClaim = true;
                    dataWallet.data = response.data.msg;
                    model.data = dataWallet;
                    console.log('failed claim! ' + dataWallet.address + ' already claimed! with proxy ${proxy.protocols[0]}://${proxy.ip}:${proxy.port}');
                    break;
                } else if(typeof response === 'object' && response.data && response.data.msg === 'The IP address has reached its limit'){
                    console.log(`proxy ${proxy.protocols[0]} ${proxy.ip}:${proxy.port} failed!`)
                    console.log(response.data);
                } else {
                    console.log(response);
                }
            }
        }
    }
    if(model.success){
        console.log('success retry claim!');
    } else {
        console.log('failed retry claim!');
    }
    return model;
}

const claim = async (walletList, retry) => {
    console.log('start claim faucet!');
    console.log('total wallet: ' + walletList.length);
    for(let datas of walletList){
        if(!datas.isAlreadyClaim){
            const data = qs.stringify({
                'address': datas.address
            });
            const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://beta-faucet-service.avt.trade/airdropOpAvt',
                    headers: { 
                        'authority': 'beta-faucet-service.avt.trade', 
                        'accept': 'application/json, text/plain, */*', 
                        'accept-language': 'en-US,en;q=0.9', 
                        'content-type': 'application/x-www-form-urlencoded', 
                        'origin': 'https://beta-water.avt.trade', 
                        'referer': 'https://beta-water.avt.trade/', 
                        'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"', 
                        'sec-ch-ua-mobile': '?0', 
                        'sec-ch-ua-platform': '"Windows"', 
                        'sec-fetch-dest': 'empty', 
                        'sec-fetch-mode': 'cors', 
                        'sec-fetch-site': 'same-site', 
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                    },
                    json: true,
                    data : data
            };
    
            const response = await axios(config).catch(function (error) {
                console.log(error);
            });
            if(response.data.code === 200){
                datas.isAlreadyClaim = true;
                console.log(`address ${datas.address} success claim!`)
            } else if(response.data.msg === 'This address has been picked up' || response.data.code === 1){
                datas.isAlreadyClaim = true;
                datas.data = response.data.data;
                console.log('failed claim! ' + datas.address + ' already claimed!');
            } else if(response.data.code === 2 || response.data.msg === 'The IP address has reached its limit'){
                console.log('limit! ganti ip sana');
                if(retry){
                    await retryClaim(datas);
                }
            } else {
                console.log('failed claim!')
            }
        }
    }
    updateWallet(walletList);
    console.log('done claim faucet!');
}
 
module.exports = {
    claim,
    retryClaim
}
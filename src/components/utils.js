import Neon, {api, wallet, settings} from "@cityofzion/neon-js";

const net = process.env.NODE_ENV === 'development' ? 'PrivateNet' : 'MainNet';


const config = {
    name: 'PrivateNet',
    extra: {
        neoscan: 'http://localhost:4000/api/main_net'
    }
};

settings.addNetwork(config);

export const COIN_DECIMAL_LENGTH = 8;

export const ASSETS = {
    NEO: 'NEO',
    GAS: 'GAS'
};

export const wifLogin = (wif) => {
    if (!wallet.isWIF(wif) && !wallet.isPrivateKey(wif)) {
        throw new Error('That is not a valid private key')
    }


    return new wallet.Account(wif)
};

export const getBalance = async (address) => {
    // console.log(await api.getBlockCount(net, address));

    const assetBalances = await api.getBalanceFrom({net, address}, api.neoscan);
    const {assets} = assetBalances.balance;

    // The API doesn't always return NEO or GAS keys if, for example, the address only has one asset
    const neoBalance = assets.NEO ? assets.NEO.balance.toString() : '0';
    const gasBalance = assets.GAS ? assets.GAS.balance.round(COIN_DECIMAL_LENGTH).toString() : '0';

    return {[ASSETS.NEO]: neoBalance, [ASSETS.GAS]: gasBalance}
};

export async function sendTransaction(opt) {
    const {from, to, neo, wif} = opt;

    const scriptHash = to.length === 40 ? to : to.slice(2, to.length);

    const scriptHashAddress = wallet.getAddressFromScriptHash(scriptHash);

    const config = {
        net,
        address: from,
        privateKey: wif,
        intents: api.makeIntent({NEO: neo}, scriptHashAddress),
        script: {
            scriptHash,
            operation: 'mintTokens',
            args: []
        },
        gas: 0
    };

    alert((await api.doInvoke(config)).response.txid)

}

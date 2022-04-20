const Hdwallet = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const wallet = new Hdwallet(
  'soccer camp coconut admit appear bronze extend little maze account head frown',
  'https://rinkeby.infura.io/v3/b3173691ee5548b2841ad1ecdc46c7f5'
);

const deploy =  async () => {
    const web3 = new Web3(wallet);

    const account = await web3.eth.getAccounts();

    const deployment = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                  .deploy({data: compiledFactory.bytecode})
                  .send({from: account[0], gas: '1000000'});

    console.log('Address of deployed contract', deployment.options.address);
};


deploy();

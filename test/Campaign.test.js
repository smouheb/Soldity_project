const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;
let manager;

beforeEach( async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                              .deploy({data: compiledFactory.bytecode})
                              .send({from: accounts[0], gas: '1000000'});

  await factory.methods.createCampaign('100')
               .send({from: accounts[0], gas:'1000000'});

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);

  manager = await campaign.methods.manager().call();

});

describe("My test", () => {
  it("Works", () => {
    assert.ok(factory.options.address);
    assert.equal(accounts[0],manager);
  });

  it("Can contribute", async () => {
    const cmp = await campaign.methods.contribute().send({from: accounts[1], value:'101'});
    const a = await campaign.methods.approvers(accounts[1]).call();
    assert.equal(cmp.from.toLowerCase(), accounts[1].toLowerCase());
  });

  it("Requires a minimum contribution", async () => {
    try {
      const a = await campaign.methods.contribute().send({from: accounts[1], value:'101'});
      assert(false);
    } catch(err) {
      assert(err);
    }
  });

  it("Create a request", async () => {
    await campaign.methods
                    .createRequest('Buy house', '1000', accounts[1])
                    .send({
                      from: accounts[0],
                      gas: '1000000'
                    });
    const res = await campaign.methods.requests(0).call();
    assert.equal('Buy house', res.description);
  });


  it("Creat and End to end flow", async () => {
    await campaign.methods
          .contribute()
          .send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
          });

    await campaign.methods
          .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[2])
          .send({from: accounts[0], gas: '1000000'});

    await campaign.methods
          .approveRequest(0)
          .send({from: accounts[1], gas: '1000000'});

    const a = await campaign.methods
          .finalizeRequest(0)
          .send({from: accounts[0], gas: '1000000'});

    const balance_raw = await web3.eth.getBalance(accounts[2]);
    const balance = parseFloat(web3.utils.fromWei(balance_raw, 'ether'));

    assert(balance > 100);

  });

});

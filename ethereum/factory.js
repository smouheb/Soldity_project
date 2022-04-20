import Web3 from './web3.js';
import Campaign from './build/CampaignFactory.json';

const instance = new Web3.eth
                         .Contract(
                           JSON.parse(Campaign.interface),
                           '0xDb46A120dc208a28E526f439d866Ab1Ba240416c'
                         );

export default instance;

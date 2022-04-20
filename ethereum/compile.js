const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractPath, 'utf8');
const output = solc.compile(source, 1).contracts;
fs.ensureDirSync(buildPath);

for(let cont in output){
  fs.outputJsonSync(
    path.resolve(buildPath, cont.replace(':', '') + '.json'),
    output[cont]
  );

}

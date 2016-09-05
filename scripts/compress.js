console.log("compress.js")
const fs = require('fs');
const ChromeExtension = require('crx');
/* eslint import/no-unresolved: 0 */
const name = require('../build/manifest.json').name;
const argv = require('minimist')(process.argv.slice(2));

const keyPath = argv.key || 'key.pem';
const existsKey = fs.existsSync(keyPath);
const crx = new ChromeExtension({
  appId: argv['app-id'],
  codebase: argv.codebase,
  privateKey: existsKey ? fs.readFileSync(keyPath) : null
});

console.log("\ncrx:", crx);
console.log("existsKey:", existsKey);
console.log("argv:", argv);

crx.load('build')
  .then(() => crx.loadContents())
  .then(archiveBuffer => {
    fs.writeFile(`${name}.zip`, archiveBuffer);
    console.log("1", existsKey, argv.codebase)
    if (!argv.codebase || !existsKey) return;
    console.log("2")
    crx.pack(archiveBuffer).then(crxBuffer => {
      const updateXML = crx.generateUpdateXML();

      fs.writeFile('update.xml', updateXML);
      fs.writeFile(`${name}.crx`, crxBuffer);
    });
  });

const tasks = require('./tasks');

tasks.replaceWebpack();
console.log('[Copy assets]');
console.log('-'.repeat(80));
tasks.copyAssets('pwa');

console.log('[PWA Webpack Build]');
console.log('-'.repeat(80));
exec('webpack --config webpack/pwa.config.js --progress --profile --colors');

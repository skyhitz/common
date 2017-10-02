require('ts-node').register(require('./tsconfig.json'));

const stores = require('./stores/index.ts');
const models = require('./models/index.ts');

module.exports = {
  stores,
  models
};
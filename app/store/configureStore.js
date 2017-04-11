if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.prod');
} else if (process.env.NODE_ENV === 'pwa') {
  module.exports = require('./configureStore.pwa');
} else {
  module.exports = require('./configureStore.dev');
}

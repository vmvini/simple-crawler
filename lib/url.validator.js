const validator = require('validator');
const isURL = (url) => validator.isURL(url);
module.exports = isURL;
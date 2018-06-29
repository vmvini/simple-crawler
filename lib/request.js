const request = require('request');

module.exports = function requestPage(uri) {
  return new Promise((resolve, reject) => {
    const options = {
      uri: uri, 
      timeout: 10000
    };
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      }
      else {
        resolve(body);
      }
    });
  });
};
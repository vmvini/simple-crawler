const request = require('request');

module.exports = function requestPage(url) {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (error) {
        reject(error);
      }
      else {
        resolve(body);
      }
    });
  });
};
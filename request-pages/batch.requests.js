const waterfall = require('async-waterfall');
const utils = require('./../lib/utils');
const requestLinks = require('./request.pages');

module.exports = function batch(urlArray, chunkSize, endCallback) {
  let chunks;
  let tasks;
  chunks = utils.chunkArray(urlArray, chunkSize);
  tasks = [
    (callback) => requestLinks(chunks[0], (logs) => callback(null, logs)), 
    ...getNextTasks(chunks.slice(1))
  ];
  waterfall(tasks, endCallback);
}

function getNextTasks(chunks) {
  return chunks.map(
    (urls) => {
      return (prevLogs, callback) => {
        requestLinks( urls, (logs) => {
          let nextLogs = [ ...logs ];
          if ( prevLogs && prevLogs.length > 0 ) {
            nextLogs = [ ...prevLogs, ...logs ];
          }
          callback(null, nextLogs);
        });
      }
    }
  );
}


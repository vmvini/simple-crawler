const fs = require('fs');
const readline = require('readline');
const readFileLineByLine = (path, onLine, onClose, onError) => {
  const readStream = fs.createReadStream(path);
  readStream.on('error', (err) => errorHandler(onError)(err) );
  const rd = readline.createInterface({
    input: readStream,
    console: false
  });
  rd.on('line', onLine);
  rd.on('close', onClose);
};

module.exports = readFileLineByLine;

function errorHandler(callback) {
  return (err) => {
    console.log('error occurred while opening file');
    console.log('\ndetails:\n', err);
    if (callback) {
      callback(err);
    }
  };
}
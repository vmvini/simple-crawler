const color = require('colors-cli');
const readFileLineByLine = require('./lib/file.reader');
const isURL = require('./lib/url.validator');
const batch = require('./request-pages');
const utils = require('./lib/utils');

const CHUNK_SIZE_DEFAULT = 50;
const args = handleArgs(process.argv);
init(args);

function init({filePath, chunkSize}) {
  const startTime = Date.now();
  const validUrls = [];
  const invalidUrls = [];
  readFileLineByLine(
    filePath,
    (line) => {
      if (isURL(line)) {
        validUrls.push(line);
      } else {
        invalidUrls.push(line);
      }
    }, 
    () => {
      showUrlsValidationStatus(invalidUrls, validUrls);
      batch(validUrls, chunkSize, (error, logs) => {
        console.log('\n\n');
        logs.forEach(l => console.log(l,'\n'));
        console.log(color.green('\n\nEND'));
        console.log(color.green(`total time: ${utils.endTime(startTime)}`));
      });
    }
  )
}

function handleArgs(args) {
  const lastArg = args.pop();
  let filePath, chunkSize = CHUNK_SIZE_DEFAULT;
  if ( isNaN(lastArg) ) {
    filePath = lastArg;
  } else {
    chunkSize = Number(lastArg);
    filePath = args.pop();
  }
  return {
    chunkSize: chunkSize, 
    filePath: filePath
  };
}

function showUrlsValidationStatus(invalid, valid) {
  console.log(color.red(`\nInvalid urls: ${invalid.length}`));
  console.log(color.green(`Valid urls: ${valid.length}\n`));
}








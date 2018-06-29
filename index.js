const color = require('colors-cli');
const readFileLineByLine = require('./lib/file.reader');
const isURL = require('./lib/url.validator');
const batch = require('./request-pages');
const utils = require('./lib/utils');

/**
 * Using chunk default size in case the user didnt provide the value in command line
 * the chunk size is used to make this tool download at most n pages simultaneously.
 * This can increase performance if you want to download thousands of pages, 
 * You should provide a reasonable chunk size value in case your txt file has hundreds, or thousands of pages.
 * For instance, for 1000 pages, I would put the chunk size as 100. 
 * This way nodejs would download only 100 pages simultaneously. 
 */
const CHUNK_SIZE_DEFAULT = 50;

//handleArgs is getting the arguments provided by the user on the command line interface. 
const args = handleArgs(process.argv);
init(args);

/**
 * this function checks if each line of the specified file is a valid URL;
 * and then, after gathering all valid urls, the function will call batch function 
 * passing the valid urls to perform a batch request to download the pages 
 * simulteneously per chunks.
 * After all the pages are downloaded, the callback (error, logs) => {} is called
 * the logs object is an array containing details about each download so we can display here.
 */
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








const color = require('colors-cli');
const waterfall = require('async-waterfall');
const readFileLineByLine = require('./lib/file.reader');
const isURL = require('./lib/url.validator');
const request = require('./lib/request');
const chunkArray = require('./lib/array.utils').chunkArray;

const args = handleArgs(process.argv);
init(args);

function showUrlsValidationStatus(invalid, valid) {
  console.log(color.red(`\nInvalid urls: ${invalid.length}`));
  console.log(color.green(`Valid urls: ${valid.length}\n`));
}

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
        console.log(color.green(`total time: ${endTime(startTime)}`));
      });
    }
  )
}

function handleArgs(args) {
  const lastArg = args.pop();
  let filePath, chunkSize = 50;
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

function batch(urlArray, chunkSize, endCallback) {
  let chunks;
  let tasks;
  chunks = chunkArray(urlArray, chunkSize);
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

function isFunc(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function requestLinks(validUrls, end) {
  let downloaded = 0;
  let linksLogs = [];
  validUrls
  .forEach( u => requestLink(u, (logs) => {
    downloaded += 1;
    linksLogs = [ ...linksLogs, ...logs ];
    console.log(color.yellow(`download ${validUrls.length - downloaded} pages simultaneously`));
    if (downloaded === validUrls.length){
      end(linksLogs);
    }
  }));
}

function requestLink(link, doneCB) {
  const startTime = Date.now();
  request(link)
  .then((html) => {
    const title = getTitle(html);
    const linkDetails = getLinkDetails(title, link, endTime(startTime));
    doneCB([linkDetails]);
  }, 
  (err) => {
    doneCB([color.red(failedLinkDetails(link))]);
  })
  .catch((err) => {
    doneCB([color.red(failedLinkDetails(link))]);
  });
}

function endTime(startTime) {
  const endTime = Date.now();
  return (endTime - startTime)/1000+'secs';
}

function getTitle(html) {
  return html.match(/<title[^>]*>([^<]+)<\/title>/)[1];
}

function getLinkDetails(title, link, time) {
  return `${color.blue(title)} : ${link} : ${color.green(time)}`;
}

function failedLinkDetails(link) {
  return `FAILED : ${link} : FAILED`;
}
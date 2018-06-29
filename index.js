const readFileLineByLine = require('./lib/file.reader');
const isURL = require('./lib/url.validator');
const request = require('./lib/request');
const color = require('colors-cli');

init(process.argv);

function init(args) {
  const startTime = Date.now();
  const filePath = args.pop();
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
      console.log(color.red('\nInvalid urls below\n'));
      invalidUrls.forEach(u => console.log(color.red(u)));
      console.log(color.green('\nGoing to download valid urls below\n'));
      validUrls.forEach(u => console.log(color.green(u)));
      console.log('\n\n\n');
      
      requestLinks(validUrls, () => {
        console.log(color.green('END'));
        console.log(color.green(`total time: ${endTime(startTime)}`));
      });
    }
  )
}

function requestLinks(validUrls, end) {
  let downloaded = 0;
  validUrls
  .forEach( u => requestLink(u, () => {
    downloaded += 1;
    if (downloaded === validUrls.length){
      end();
    }
  }));
}

function requestLink(link, doneCB) {
  const startTime = Date.now();
  request(link)
  .then((html) => {
    const title = getTitle(html);
    const linkDetails = getLinkDetails(title, link, endTime(startTime));
    console.log(linkDetails, '\n\n');
    doneCB();
  }, 
  (err) => {
    console.log(color.red(failedLinkDetails(link)), '\n');
    doneCB();
  })
  .catch((err) => {
    console.log(color.red(failedLinkDetails(link)), '\n');
    doneCB();
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
  return `${color.green(title)} : ${link} : ${color.green(time)}`;
}

function failedLinkDetails(link) {
  return `FAILED : ${link} : FAILED`;
}
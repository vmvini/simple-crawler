const color = require('colors-cli');
const request = require('./../lib/request');
const utils = require('./../lib/utils');

module.exports = function requestLinks(validUrls, end) {
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
};
  
function requestLink(link, doneCB) {
  const startTime = Date.now();
  request(link)
  .then((html) => {
    const title = utils.getTitle(html);
    const linkDetails = getLinkDetails(title, link, utils.endTime(startTime));
    doneCB([linkDetails]);
  }, 
  (err) => {
    doneCB([color.red(failedLinkDetails(link))]);
  })
  .catch((err) => {
    doneCB([color.red(failedLinkDetails(link))]);
  });
}
  

function getLinkDetails(title, link, time) {
  return `${color.blue(title)} : ${link} : ${color.green(time)}`;
}
  
function failedLinkDetails(link) {
  return `FAILED : ${link} : FAILED`;
}
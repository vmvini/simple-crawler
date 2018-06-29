const chunkArray = (myArray, chunk_size) => {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
    
  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index+chunk_size);
    tempArray.push(myChunk);
  }

  return tempArray;
};

const isFunc = (functionToCheck) => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

const endTime = (startTime) => {
  const endTime = Date.now();
  return (endTime - startTime)/1000+'secs';
};

const getTitle = (html) => {
  return html.match(/<title[^>]*>([^<]+)<\/title>/)[1];
};

module.exports = {
  chunkArray: chunkArray,
  isFunc: isFunc,
  endTime: endTime,
  getTitle: getTitle,
};
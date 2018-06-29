/**
 * 
 * This function allows the node server to use jquery
 * to help extracting complex dom elements from html strings returned by http requests.
 * But for this example is not being used yet. 
 */
module.exports = function ( command ) {
  require("jsdom/lib/old-api")
  .env("", (err, window) => {
    if (err) {
      console.error("error loading jsdom \n", err);
      return;
    }
    const jquery = require("jquery")(window);
    command(jquery);
  });
};
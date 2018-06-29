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
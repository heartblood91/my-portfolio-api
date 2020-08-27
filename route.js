const test = require("./test/test");

// Gestion des routes du serveur backend
module.exports = function (expressServer) {
  //Test
  expressServer.get("/test", test.test);
};

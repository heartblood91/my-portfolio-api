const sender = require("./sendMail.js");

// Gestion des routes du serveur backend
module.exports = function (expressServer) {
  //Envoie d'e-mail
  expressServer.post("/sendAMail", sender.sendMeAMail);
};

const sender = require("./sendMail");
const creator = require("./managementToken");

// Gestion des routes du serveur backend
module.exports = function (expressServer) {
  //Envoie d'e-mail
  expressServer.post("/sendAMail", sender.sendMeAMail);

  //Créateur de token pour le formulaire
  expressServer.get("/createToken", creator.createToken);
};

const nodemailer = require("nodemailer");

const sender = (email, subject, message, messageHTML) => {
  return new Promise((resolve, reject) => {
    async function main() {
      // Création du transporteur
      let transporter = nodemailer.createTransport({
        host: process.env.CV_Mail_SMTP, //serveur smtp
        port: process.env.CV_Mail_Port, //port
        secure: false, // true pour le port 465, false pour les autres
        auth: {
          user: process.env.CV_Mail_User, // utilisateur
          pass: process.env.CV_Mail_Pass, // mot de passe
        },
      });

      // send email with defined transport object
      await transporter.sendMail({
        from: process.env.CV_Mail_From, // Expéditeur
        to: email, // Destinataires (si plusieurs les séparés par des ,)
        subject: subject, // Sujet du email
        text: message, // Texte sans HTML
        html: messageHTML, // Texte avec du html
      });
      resolve("Message envoyé");
    }

    main().catch((err) => reject(err));
  });
};

module.exports.sendMeAMail = (req, res, next) => {
  // Etape 0: Je récupère les informations
  // Récupération des variables contenues dans le body
  const { email, name, firstname, message, tel } = req.body;

  // Etape 1: Je prépare le 1er email (la transmission du message du client)
  // Création du sujet du email
  let subject = "De la part de " + firstname + " " + name + " sur votre CV";

  // Corps du email
  let messageAutoWithoutHTML =
    "Cédric, \n\nJe vous fais parvenir un message avec les informations suivantes depuis votre CV en ligne: \n" +
    "\nPrénom: " +
    firstname +
    "\nNom: " +
    name +
    "\nEmail: " +
    email +
    "\nTéléphone: " +
    tel +
    "\n\nMessage:\n\n" +
    message;

  //Transforme le texte simple en texte html
  let messageAutoWithHTML = messageAutoWithoutHTML.replace(/\n/g, "<br>");

  // 1ère étape, je m'envoie un email avec les informations contenues dans le formulaire
  sender(
    process.env.CV_Mail_To,
    subject,
    messageAutoWithoutHTML,
    messageAutoWithHTML
  )
    .then((resultat) => res.status(200).send(resultat))
    .catch((err) => res.status(400).send(err));

  // Etape 2: Je prépare le second email (accusé récéption pour le client)
  // Création du sujet du email
  subject = "Merci " + firstname + " pour votre message!";

  // Création du message du email
  messageAutoWithoutHTML =
    "Cher/Chère " +
    firstname +
    "\n\nTout d'abord, merci pour votre message sur mon CV Web. \n\nJe vais le lire attentivement, je ne manquerai pas de vous faire un retour dès que possible! \n\nCordialement, \nCédric";

  //Transforme le texte simple en texte html
  messageAutoWithHTML = messageAutoWithoutHTML.replace(/\n/g, "<br>");

  //2e etape, j'envoie une email type accusé de récéption au client
  sender(email, subject, messageAutoWithoutHTML, messageAutoWithHTML)
    .then((resultat) => console.log(resultat))
    .catch((err) => console.log(err));
};

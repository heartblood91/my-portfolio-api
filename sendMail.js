const nodemailer = require("nodemailer");

const sender = (mail, subject, message, messageHTML) => {
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

      // send mail with defined transport object
      await transporter.sendMail({
        from: process.env.CV_Mail_From, // Expéditeur
        to: mail, // Destinataires (si plusieurs les séparés par des ,)
        subject: subject, // Sujet du mail
        text: message, // Texte sans HTML
        html: messageHTML, // Texte avec du html
      });
      resolve("Message envoyé");
    }

    main().catch((err) => reject(err));
  });
};

module.exports.sendMeAMail = (req, res, next) => {
  // Récupération des variables contenues dans le body
  const { mail, name, firstname, message } = req.body;

  // Création du sujet du mail
  let subject = "De la part de " + firstname + " " + name + " sur votre CV";

  // 1ère étape, je m'envoie un mail avec les informations contenues dans le formulaire
  sender(process.env.CV_Mail_To, subject, message, message)
    .then((resultat) => res.status(200).send(resultat))
    .catch((err) => res.status(400).send(err));

  // Création du sujet du mail
  subject = "Merci " + firstname + " pour votre message!";

  // Création du message du mail
  const messageAutoWithoutHTML =
    "Cher/Chère " +
    firstname +
    "\n\nTout d'abord, merci pour votre message sur mon CV Web. \nJe vais le lire attentivement, je ne manquerai pas de vous faire un retour dès que possible! \n\nCordialement, \nCédric";

  const messageAutoWithHTML =
    "Cher/Chère <strong>" +
    firstname +
    "</strong><br><br>Tout d'abord, merci pour votre message sur mon CV Web. <br>Je vais le lire attentivement, je ne manquerai pas de vous faire un retour dès que possible! <br><br>Cordialement, <br>Cédric";

  //2e etape, j'envoie une mail type accusé de récéption au client
  sender(mail, subject, messageAutoWithoutHTML, messageAutoWithHTML)
    .then((resultat) => console.log(resultat))
    .catch((err) => console.log(err));
};

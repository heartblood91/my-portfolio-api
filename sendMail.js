const nodemailer = require("nodemailer");

const sender = (mail, name, firstname, message) => {
  //const subject = "De la part de " + firstname + " " + name + " sur votre CV";

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
        subject: "De la part de " + firstname + " " + name + " sur votre CV", // Sujet du mail
        text: message, // Texte sans HTML
        html: message, // Texte avec du html
      });
      resolve("Message envoyé");
    }

    main().catch((err) => reject(err));
  });
};

module.exports.sendMeAMail = (req, res, next) => {
  const { mail, name, firstname, message } = req.body;

  sender(mail, name, firstname, message)
    .then((resultat) => res.status(200).send(resultat))
    .catch((err) => res.status(400).send(err));
};

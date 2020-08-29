const express = require("express");
const morgan = require("morgan");
const expressServer = express();
const router = require("./route");
const http = require("http");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const bodyParser = require("body-parser");

// Récupère les informations sensibles
require("dotenv").config();

// Port:
const PORT =
  process.env.NODE_ENV.indexOf("production") > -1
    ? process.env.CV_PORT_PROD
    : process.env.CV_PORT_DEV;

// Permet d'utiliser  la compression gzip --> amélioration des perfs
expressServer.use(compression());

//Permet de protéger le header
expressServer.use(helmet());

// Permet au serveur d'utiliser des extensions (morgan pour les api + de parser le json + les cors)
expressServer.use(morgan("combined"));
expressServer.use(bodyParser.json({ type: "*/*" }));
expressServer.use(cors());

// Créer le serveur
const server = http.createServer(expressServer);
router(expressServer);
server.listen(PORT);

console.log("le serveur écoute sur le port : ", PORT);

// Quelques variables
const expirationTime = 43200; // Temps en secondes avant expiration du token (defaut: 12h --> 43 200)
let fakeToken = { token: "", timeStamp: 0 };

// Fonction permettant de vérifier la validité temporelle du token
const isExpired = () => {
  // Je récupère l'heure actuelle en timestamp
  const timestampNow = makeATimeStamp();

  // Je vérifie la date du token
  const tokenIsExpired = fakeToken.timeStamp <= timestampNow ? true : false; //+ deltaExpiration

  // Si expiré alors j'en créé un nouveau
  if (tokenIsExpired) {
    fakeToken.token = makeAFakeToken();
    fakeToken.timeStamp = makeATimeStamp() + expirationTime;
  }

  // Je retourne, pour information, si le token est périmé ou non
  return tokenIsExpired;
};

module.exports.createToken = function (req, res, next) {
  // Etape 1 : Je vérifie la date du token
  isExpired();

  // Etape 2: Je transmet le token
  res.status(200).send(fakeToken.token);
};

// Création d'un timestamp
const makeATimeStamp = () => {
  return (aTimeStamp = parseInt(Date.now().toString().slice(0, 10)));
};

// Création d'un faux token
const makeAFakeToken = () => {
  // Fixe les variables:
  let result = "";

  // Caractères autorisés
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  const charactersLength = characters.length;

  // Création d'une chaine de 24 caractères comprise dans les caractères autorisés (aléatoirement)
  for (let i = 0; i < 24; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports.verifyToken = (tokenToCheck) => {
  let result = "";

  //Etape 1 : Je vérifie la correspondance entre les 2 tokens
  if (tokenToCheck === fakeToken.token) {
    //Etape 2: Je vérifie que le token est toujours valide en temporalité
    result = isExpired() ? fakeToken.token : "OK";
  } else {
    result = "unauthorized";
  }

  // On retourne le résultat
  return result;
};

import express from "express";
import mysql from "mysql";
import addUser from "./addUser";
import removeUser from "./removeUser";
import updateUser from "./updateUser";
import authUser from "./authUser";

// Création de la connexion à la base de données
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test de la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données : ", err);
  } else {
    console.log("Connexion à la base de données établie.");
  }
});

function generateToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const tokenLength = 20;
  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}





// Fermeture de la connexion à la base de données lorsque l'application est arrêtée
process.on("SIGINT", () =>
connection.end((err) => {
    console.log("Fermeture de la connexion à la base de données.");
    process.exit(err ? 1 : 0);
})
);

const app = express();

app.get("/", (req, res) => {
    connection.query('SELECT * FROM userTab', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération des utilisateurs');
    } else {
      console.log("affichage des users effectués");
      res.send(results);
    }
  });
});

app.post("/addUser", (req, res) => {
    addUser("test", "password123");
});

app.delete("/removeUser", (req, res) => {
    removeUser("test", "password123");
});

app.put("/updateUser/:login/:password", (req, res) => {
  var login = req.params.login;
  var password = req.params.password;
  updateUser("test","test2", "password123");
});

app.put("/auth", (req, res) => {
  const { login, password } = req.body;
  const token = generateToken();
  authUser(login, password, token, (err: any, result: string) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur lors de l'authentification");
    } else if (result === "Utilisateur ou mot de passe incorrect") {
      res.status(401).send("Utilisateur ou mot de passe incorrect");
    } else {
      res.send(result);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
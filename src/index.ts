import express from "express";
import mysql from "mysql";
import addUser from "./addUser";
import removeUser from "./removeUser";
import updateUser from "./updateUser";

// Création de la connexion à la base de données
const connection = mysql.createConnection({
  host: "mysql-qmoskwa.alwaysdata.net",
  user: "qmoskwa",
  password: "23juin06",
  database: "qmoskwa_tpfullstack",
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
      res.send(results);
    }
  });
});
app.get("/addUser", (req, res) => {
    addUser("test", "password123", generateToken());
    res.redirect("/");
});
app.get("/removeUser", (req, res) => {
    removeUser("test", "password123");
    res.redirect("/");
});
app.get("/updateUser", (req, res) => {
    updateUser("test","test2", "password123");
    res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
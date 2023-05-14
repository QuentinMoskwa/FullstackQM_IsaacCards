import express from "express";
import mysql from "mysql";

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

// Fermeture de la connexion à la base de données lorsque l'application est arrêtée
process.on("SIGINT", () =>
  connection.end((err) => {
    console.log("Fermeture de la connexion à la base de données.");
    process.exit(err ? 1 : 0);
  })
);


const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

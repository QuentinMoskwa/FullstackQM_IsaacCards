import mysql from "mysql";
import bcrypt from "bcryptjs";
import express from "express";

const app = express();


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

// Fermeture de la connexion à la base de données lorsque l'application est arrêtée
process.on("SIGINT", () =>
  connection.end((err) => {
    console.log("Fermeture de la connexion à la base de données.");
    process.exit(err ? 1 : 0);
  })
);


const addUser = (login: string, password: string) => {
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  //   verification de l'unicité du nouveau nom d'utilisateur
  connection.query(
    "SELECT COUNT(*) AS count FROM userTab WHERE login = ?",
    [login],
    (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      const count = results[0].count;
      if (count > 0) {
        console.log(`User ${login} already exists.`);
        return;
      }
    //   insertion du nouvel utilisateur
      const user = { login, password: hashedPassword};
      connection.query("INSERT INTO userTab SET ?", user, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(`User ${login} added successfully!`);
      });
    }
  );
};


export default addUser;

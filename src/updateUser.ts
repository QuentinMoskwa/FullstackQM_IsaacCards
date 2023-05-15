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



const updateUser = (login: string, newLogin: string, newPassword: string) => {
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

  connection.query(
    // verification de la présence de l'ancien nom d'utilisateur
    "SELECT COUNT(*) AS count FROM userTab WHERE login = ?",
    [login],
    (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      const count = results[0].count;
      if (count === 0) {
        console.log(`User ${login} does not exist.`);
        return;
      }
    //   verification de l'unicité du nouveau nom d'utilisateur
      connection.query(
        "SELECT COUNT(*) AS count FROM userTab WHERE login = ?",
        [newLogin],
        (error, results) => {
          if (error) {
            console.error(error);
            return;
          }

          const count = results[0].count;
          if (count > 0) {
            console.log(`User ${newLogin} already exists.`);
            return;
          }
        //   assignation des nouvelles info
          const user = {
            login: newLogin,
            password: hashedPassword,
          };
          connection.query(
            "UPDATE userTab SET ? WHERE login = ?",
            [user, login],
            (error, results) => {
              if (error) {
                console.error(error);
                return;
              }
              console.log(`User ${newLogin} updated successfully!`);
            }
          );
        }
      );
    }
  );
};


export default updateUser;
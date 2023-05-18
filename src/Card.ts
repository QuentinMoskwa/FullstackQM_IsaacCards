import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

// Création de la connexion à la base de données
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
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

const createIsaacCard = (login: string) => {
  connection.query(
    `SELECT * FROM userTab WHERE login = ? AND token IS NOT NULL AND token != ''`,
    [login],
    (err, results) => {
      if (err) {
        console.error(err);
      } else if (results.length === 0) {
        console.log("Utilisateur non valide ou jeton manquant.");
      } else {
        const newCard = {
          userName: login,
          cardName: "BlueBaby",
          power: 20,
        };

        connection.query(
          `INSERT INTO isaacCard SET ?`,
          newCard,
          (err, results) => {
            if (err) {
              console.error(err);
            } else {
              console.log("Nouvelle carte créée avec succès !");
            }
          }
        );
      }
    }
  );
};

const readIsaacCard = (login: string, cardName : string = "") => {
  connection.query(
    `SELECT * FROM userTab WHERE login = ? AND token IS NOT NULL AND token != ''`,
    [login],
    (err, results) => {
      if (err) {
        console.error(err);
      } else if (results.length === 0) {
        console.log("Utilisateur non valide ou jeton manquant.");
      } else {
        if(cardName === "")
        {
          connection.query(`SELECT * FROM isaacCard WHERE userName = ?`, [login], (err, results) => {
            if (err) {
              console.error(err);
            } else if (results.length === 0) {
              console.log("L'utilisateur ne possède pas de cartes");
            } else {
              console.log("Liste des cartes :");
              console.log(results);
            }
          });
        }
        else
        {
          connection.query(`SELECT * FROM isaacCard WHERE userName = ? AND cardName = ?`, [login, cardName], (err, results) => {
            if (err) {
              console.error(err);
            } else if (results.length === 0) {
              console.log("L'utilisateur ne possède pas cette carte");
            } else {
              console.log("Liste des cartes :");
              console.log(results);
            }
          });
        }
      }
    }
  );
};

const updateIsaacCard = (login: string, cardName: string, newPower: number) => {
  connection.query(
    `SELECT * FROM userTab WHERE login = ? AND token IS NOT NULL AND token != ''`,
    [login],
    (err, results) => {
      if (err) {
        console.error(err);
      } else if (results.length === 0) {
        console.log("Utilisateur non valide ou jeton manquant.");
      } else {
        connection.query(
          `UPDATE isaacCard SET power = ? WHERE cardName = ?`,
          [newPower, cardName],
          (err, results) => {
            if (err) {
              console.error(err);
            } else {
              console.log("Carte mise à jour avec succès !");
            }
          }
        );
      }
    }
  );
};

const deleteIsaacCard = (login: string, cardName: string) => {
  connection.query(
    `SELECT * FROM userTab WHERE login = ? AND token IS NOT NULL AND token != ''`,
    [login],
    (err, results) => {
      if (err) {
        console.error(err);
      } else if (results.length === 0) {
        console.log("Utilisateur non valide ou jeton manquant.");
      } else {
        connection.query(
          `DELETE FROM isaacCard WHERE cardName = ?`,
          [cardName],
          (err, results) => {
            if (err) {
              console.error(err);
            } else {
              console.log("Carte supprimée avec succès !");
            }
          }
        );
      }
    }
  );
};

export {createIsaacCard, readIsaacCard, updateIsaacCard, deleteIsaacCard};
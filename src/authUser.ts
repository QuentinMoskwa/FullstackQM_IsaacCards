import mysql from "mysql";
import bcrypt from "bcryptjs";

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

const authUser = (
  login: string,
  password: string,
  token: string,
  callback: Function
) => {
  connection.query(
    `SELECT * FROM Users WHERE login = ?`,
    [login],
    (err, res) => {
      if (err) {
        callback(err);
      } else if (res.length === 0) {
        callback(null, "Utilisateur ou mot de passe incorrect");
      } else {
        const user = res[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            callback(err);
          } else if (!result) {
            callback(null, "Utilisateur ou mot de passe incorrect");
          } else {
            connection.query(
              `UPDATE Users SET token = ? WHERE login = ?`,
              [token, login],
              (err, results) => {
                if (err) {
                  callback(err);
                } else {
                  callback(null, token);
                }
              }
            );
          }
        });
      }
    }
  );
};

export default authUser;

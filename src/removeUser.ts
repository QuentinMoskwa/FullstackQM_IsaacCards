import mysql from "mysql";
import bcrypt from "bcryptjs";

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

const removeUser = (login: string, password: string) => {
  // Vérification du mot de passe
  connection.query(
    "SELECT password FROM userTab WHERE login = ?",
    [login],
    (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
    //   verification de la présence du nom d'utilisateur
      if (results.length === 0) {
        console.log(`User ${login} not found!`);
        return;
      }
      const hashedPassword = results[0].password;
      if (!bcrypt.compareSync(password, hashedPassword)) {
        console.log(`Wrong password for user ${login}!`);
        return;
      }

      // Suppression de l'utilisateur
      connection.query(
        "DELETE FROM userTab WHERE login = ?",
        [login],
        (error, results) => {
          if (error) {
            console.error(error);
            return;
          }
          console.log(`User ${login} removed successfully!`);
        }
      );
    }
  );
};

export default removeUser;

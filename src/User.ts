import mysql from "mysql";
import bcrypt from "bcryptjs";
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
      const user = { login, password: hashedPassword };
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

const authUser = (token: string) => {
  const login = "test";
  const password = "password123";
  connection.query(
    `SELECT * FROM userTab WHERE login = ?`,
    [login],
    (err, results) => {
      if (err) {
        console.error(err);
      } else if (results.length === 0) {
        console.log("Utilisateur inexistant");
      } else {
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
          if (err) {
            console.error(err);
          } else if (!isMatch) {
            console.log("Mot de passe incorrect");
          } else {
            connection.query(
              `UPDATE userTab SET token = ? WHERE login = ?`,
              [token, login],
              (err, results) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log("Authentification réussie");
                }
              }
            );
          }
        });
      }
    }
  );
};

const disconnectUser = () => {
  const login = "test";
  const password = "password123";
  connection.query(
    `SELECT * FROM userTab WHERE login = ?`,
    [login],
    (err, results) => {
      if (err) {
        console.error(err);
      } else if (results.length === 0) {
        console.log("Utilisateur inexistant");
      } else {
        bcrypt.compare(password, results[0].password, (err, isMatch) => {
          if (err) {
            console.error(err);
          } else if (!isMatch) {
            console.log("Mot de passe incorrect");
          } else {
            connection.query(
              `UPDATE userTab SET token = ? WHERE login = ?`,
              ["", login],
              (err, results) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log("Déconnection réussie");
                }
              }
            );
          }
        });
      }
    }
  );
};

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

export { addUser, authUser, disconnectUser, removeUser, updateUser };

import express from "express";
import mysql from "mysql";
import {
  addUser,
  authUser,
  disconnectUser,
  removeUser,
  updateUser,
} from "./User";
import {
  createIsaacCard,
  readIsaacCard,
  updateIsaacCard,
  deleteIsaacCard,
} from "./Card";
import dotenv from "dotenv";

dotenv.config();

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

const app = express();

app.get("/", (req,res) => {
  res.send("Hello World");
})

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

app.put("/auth", (req, res: express.Response) => {
  authUser(generateToken());
});

app.put("/disconnect/:login/:password", (req, res) => {
  var login = req.params.login;
  var password = req.params.password;
  disconnectUser();
});

// cards

app.post("/addCard/:login", (req, res) => {
  var login = req.params.login;
  createIsaacCard(login);
});

app.get("/readCards/:login", (req, res) => {
  var login = req.params.login;
  readIsaacCard(login);
});
app.get("/readCards/:login/:cardName", (req, res) => {
  var login = req.params.login;
  var cardName = req.params.cardName;
  readIsaacCard(login, cardName);
});

app.put("/updateIsaacCard/:login/:cardName", (req, res) => {
  var login = req.params.login;
  var cardName = req.params.cardName;
  updateIsaacCard(login, cardName, 50);
});

app.delete("/deleteIsaacCard/:login/:cardName", (req, res) => {
  var login = req.params.login;
  var cardName = req.params.cardName;
  deleteIsaacCard(login, cardName);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
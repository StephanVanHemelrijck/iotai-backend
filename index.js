const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Make connection with MySQL database
const DBConnection = require("./HelperFunctions/connection.js");

const server = express();

// Middleware
server.use(cors());
server.use(bodyParser.json());
server.use(express.static(__dirname + "/docs"));

server.get("/", (req, res) => {
  res.status(300).redirect("/index.html");
});

server.get("/players", (req, res) => {
  try {
    DBConnection.query("SELECT * FROM players", function (err, result) {
      if (err) throw err;
      res.send(result);
    });
  } catch (err) {
    res.send(err);
  }
});

server.listen(1337, () => {
  console.log(`Listening on port 1337 at http://localhost:1337`);
});

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const port = 3000;

// Establishing connection to the MySQL database
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "atsiliepimai_api",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL database!");
});

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Retrieve all reviews
app.get("/api/atsiliepimai/", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.json(result);
  });
});

// Retrieve average rating
app.get("/api/atsiliepimai/vertinimas", (req, res) => {
  let sql = "SELECT AVG(vertinimas) as vidurkis FROM atsiliepimai";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.json(result);
  });
});

// Retrieve reviews, sorted from newest to oldest
app.get("/api/atsiliepimai/sort/new", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai ORDER BY laikas";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.json(result);
  });
});

// Retrieve reviews, sorted from oldest to newest
app.get("/api/atsiliepimai/sort/old", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai ORDER BY laikas DESC";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.json(result);
  });
});

// Retrieve reviews, sorted by highest rating first
app.get("/api/atsiliepimai/sort/good", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai ORDER BY vertinimas DESC";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.json(result);
  });
});

// Retrieve reviews, sorted by lowest rating first
app.get("/api/atsiliepimai/sort/bad", (req, res) => {
  let sql = "SELECT * FROM atsiliepimai ORDER BY vertinimas";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.json(result);
  });
});

// Retrieve information for a specific review by ID
app.get("/api/atsiliepimai/:id", (req, res) => {
  let id = req.params.id;
  let sql = "SELECT * FROM atsiliepimai WHERE id = ?";
  con.query(sql, [id], function (err, result, fields) {
    if (err) throw err;

    res.json(result);
  });
});

// Create a new review
app.post("/api/atsiliepimai/", (req, res) => {
  let { vardas, pastas, vertinimas, tekstas } = req.body;
  let sql = "INSERT INTO atsiliepimai (vardas, pastas, vertinimas, tekstas) VALUES (?, ?, ?, ?)";
  con.query(sql, [vardas, pastas, vertinimas, tekstas], function (err, result, fields) {
    if (err) throw err;

    res.json({
      status: "success",
      data: {
        id: result.insertId,
      },
    });
  });
});

// Update information for a specific review by ID
app.put("/api/atsiliepimai/:id", (req, res) => {
  let id = req.params.id;
  let sql = "SELECT * FROM atsiliepimai WHERE id = ?";
  con.query(sql, [id], function (err, result, fields) {
    if (err) throw err;

    if (result.length) {
      let atsiliepimas = result[0];

      if (req.body.vardas) {
        atsiliepimas.vardas = req.body.vardas;
      }

      if (req.body.pastas) {
        atsiliepimas.pastas = req.body.pastas;
      }

      if (req.body.vertinimas) {
        atsiliepimas.vertinimas = req.body.vertinimas;
      }

      if (req.body.tekstas) {
        atsiliepimas.tekstas = req.body.tekstas;
      }

      let updateSql =
        "UPDATE atsiliepimai SET vardas = ?, pastas = ?, vertinimas = ?, tekstas = ? WHERE id = ?";
      con.query(
        updateSql,
        [atsiliepimas.vardas, atsiliepimas.pastas, atsiliepimas.vertinimas, atsiliepimas.tekstas, id],
        function (err, result, fields) {
          if (err) throw err;

          res.json({
            status: "success",
          });
        }
      );
    } else {
      res.status(404).send({
        status: 404,
        message: "Error: not found",
      });
    }
  });
});

// Delete a review by ID
app.delete("/api/atsiliepimai/:id", (req, res) => {
  let id = req.params.id;
  let sql = "SELECT * FROM atsiliepimai WHERE id = ?";
  con.query(sql, [id], function (err, result, fields) {
    if (err) throw err;

    if (result.length) {
      let deleteSql = "DELETE FROM atsiliepimai WHERE id = ?";
      con.query(deleteSql, [id], function (err, result, fields) {
        if (err) throw err;

        res.json({
          status: "success",
        });
      });
    } else {
      res.status(404).send({
        status: 404,
        message: "Error: not found",
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

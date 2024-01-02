const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var mysql = require("mysql");
const app = express();
const port = 4000;
const multer = require("multer");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodenew",
});
connection.connect();
app.get("/home", (req, res) => {
  connection.query("select * from users", function (err, rows) {
    // res.send(rows);
    if (!!err) {
      console.log("error", +err);
    } else {
      res.render("index", { data: rows });
    }
  });
});

app.post("/home", upload.single("image"), (req, res) => {
  // let name = req.body.name;
  const { name } = req.body;

  // const { image } = req.fieldname;
  const img = `/uploads/${req.file.filename}`;

  connection.query(
    "insert into users (userName,image) values(?,?) ",
    [name, img],
    function (err, rows, fields) {
      if (!!err) {
        console.log("error", +err);
      } else {
        res.redirect("/home");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");


//db configration
const db = require("./config/keys").MongoURI;

//connection to mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("mongodb connected. . .");
  })
  .catch((err) => console.log(err));

// EJS , View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//BodyParser
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is up on ${PORT}`));

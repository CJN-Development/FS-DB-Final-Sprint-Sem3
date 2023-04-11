const express = require("express");
const methodOverride = require("method-override");
const app = express();
const PORT = 3000;

global.DEBUG = true;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // This is important!
app.use(methodOverride("_method")); // So is this!

app.get("/", (req, res) => {
  res.render("index.ejs");
});

const searchRouter = require("./routes/search");

app.use("/search", searchRouter);

app.get("/searchpage", (req, res) => {
  res.render("searchpage");
});

app.get("/search", (req, res) => {
  const keyword = req.query.q;
  const database = req.query.db;

  const searchResults = searchDatabase(keyword, database);
  res.render("searchResult", { Database: database, aSearch: searchResults });
});

app.listen(PORT, () => {
  console.log(`Simple app running on port ${PORT}.`);
});
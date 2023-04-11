const express = require("express");
const methodOverride = require("method-override");
const app = express();
const PORT = 3000;

const logEvents = require("./logevents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

global.DEBUG = true;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

app.use((req, res) => {
  myEmitter.emit("log", "404", "ERROR", "Content is not Found");
  res.status(404).render("404");
});

//404 Error Page
app.get("/404", (request, response) => {
  response.render("404.ejs");
});

//503 Error Page
app.get("/503", (request, response) => {
  response.render("503.ejs");
});

//No record Error page
app.get("/norecord", (request, response) => {
  response.render("norecord.ejs");
});

app.listen(PORT, () => {
  console.log(`Simple app running on port ${PORT}.`);
});

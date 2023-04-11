const express = require("express");
const router = express.Router();
const postgresSearch = require(".././services/seachDAL");
const mongoSearch = require("../services/mongoSearch");

const logEvents = require("../logevents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

router.get("/", async (req, res) => {
  let searchDal;
  if (req.query.db === "postgres") {
    searchDal = postgresSearch;
  } else if (req.query.db === "mongo") {
    searchDal = mongoSearch;
  } else {
    searchDal = postgresSearch && mongoSearch;
  }

  try {
    let aSearch = await searchDal.searchDatabase(req.query.q, req.query.db);
    console.log(req.query.db);
    if (aSearch.length === 0) console.log("norecord");
    else res.render("searchResult.ejs", { aSearch });
  } catch {
    res.render("503");
    myEmitter.emit("log", "aSearch", "ERROR", "Search Results has Failed!");
  }
});

module.exports = router;

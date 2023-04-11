const express = require("express");
const router = express.Router();
const postgresSearch = require('.././services/seachDAL')
const mongoSearch = require("../services/mongoSearch");

router.get("/", async (req, res) => {
  let searchDal;
  if(req.query.db === "postgres"){
    searchDal = postgresSearch
  } else if(req.query.db === "mongo") {
    searchDal = mongoSearch
    
  } else {
    searchDal = postgresSearch && mongoSearch
  }

  try {
    let aSearch = await searchDal.searchDatabase(req.query.q, req.query.db);
    console.log(req.query.db);
    if (aSearch.length === 0) console.log(" Good");
    else res.render("searchResult.ejs", { aSearch });
  } catch {
    console.log("503");
  }
});

module.exports = router;

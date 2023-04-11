const { ObjectId } = require("mongodb");
const dal = require("./mdb");

// async function searchDatabase(keyword, database) {
//     dal.connect()
//   };

//   async function searchDatabase(keyword) {
//     if(DEBUG) console.log("actors.mongo.dal.getActorByActorId()");
//     try {
//       await dal.connect();
//       const result = dal.db("Sprint2").collection("students").find(keyword);
//       return result;
//     } catch(error) {
//       console.log(error);
//     }
//   };

async function searchDatabase(keyword) {
  if (DEBUG) console.log("searchDatabase()");
  try {
    await dal.connect();

    const result = await dal
      .db("Sprint2")
      .collection("students")
      .find({ $text: { $search: keyword } });
    return result.toArray();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  searchDatabase,
};

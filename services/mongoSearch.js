const { ObjectId } = require("mongodb");
const dal = require("./mdb");

const logEvents = require("../logevents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

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
    myEmitter.emit(
      "log",
      "searhDatabase",
      "INFO",
      "searchDatabase was Successful!(MongoDB)!"
    );
    await dal.connect();

    const result = await dal
      .db("Sprint2")
      .collection("students")
      .find({ $text: { $search: keyword } });
    return result.toArray();
  } catch (error) {
    myEmitter.emit(
      "log",
      "searhDatabase",
      "ERROR",
      "searchDatabase has Failed!(MongoDB)!"
    );
  }
}

module.exports = {
  searchDatabase,
};

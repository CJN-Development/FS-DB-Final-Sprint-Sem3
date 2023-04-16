const { ObjectId } = require("mongodb");
const dal = require("./mdb");

const logEvents = require("../logevents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

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
    const query = {
      $or: [
        { id: { $regex: keyword, $options: 'i' } },
        { first_name: { $regex: keyword, $options: 'i' } },
        { last_name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { gender: { $regex: keyword, $options: 'i' } },
        { age: { $regex: keyword, $options: 'i' } },
        { semester: { $regex: keyword, $options: 'i' } }
      ]
    };
    const result = await dal
      .db("Sprint2")
      .collection("students")
      .find(query);
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

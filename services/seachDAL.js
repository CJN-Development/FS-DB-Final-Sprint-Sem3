const dal = require("./auth_PG_DB");
const mDal = require("./mdb");

var searchDatabase = function (keyword, database) {
  if (DEBUG) console.log("logins.pg.dal.getLoginByLoginId()");

  return new Promise(function (resolve, reject) {
    const sql = `SELECT * FROM students WHERE CAST (id AS TEXT) LIKE $1 OR first_name LIKE $1 OR last_name LIKE $1 OR email LIKE $1 OR gender LIKE $1 OR CAST (age AS TEXT) LIKE $1 OR CAST (semester AS TEXT) LIKE $1`;
    dal.query(sql, [`%${keyword}%`], (err, result) => {
      if (err) {
        if (DEBUG) console.log(err);
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};

module.exports = {
  searchDatabase,
};

// var searchDatabase = function(keyword,database) {
//     if(DEBUG) console.log("logins.pg.dal.getLoginByLoginId()");

//     return new Promise(function(resolve, reject) {

//       if(database == "postgres"){
//         const sql = `SELECT * FROM students WHERE CAST (id AS TEXT) LIKE $1 OR first_name LIKE $1 OR last_name LIKE $1 OR email LIKE $1 OR gender LIKE $1 OR CAST (age AS TEXT) LIKE $1 OR CAST (semester AS TEXT) LIKE $1`;
//       dal.query(sql, [`%${keyword}%`], (err, result) => {
//         if (err) {
//           if(DEBUG) console.log(err);
//           reject(err);
//         } else {
//           resolve(result.rows);
//         }
//       });

//       } else{
//         try{
//             mDal.connect();
//             const cursor = dal.db("Sprint2").collection("students").find(keyword);
//             const results = await cursor.toArray();
//             resolve(results)

//         } catch(error){
//           console.log(error)
//           reject(error)
//         }

//       }

//       }

//     });
//   };

//   module.exports = {
//     searchDatabase
// }

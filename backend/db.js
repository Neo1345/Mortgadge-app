const oracledb = require("oracledb");

// async function connectToOracle() {
//   let connection;

//   try {
//     // Connect to Oracle DB
//     connection = await oracledb.getConnection({
//       user: "system",
//       password: "Broad1234",
//       connectString: "localhost:1521/XE" // adjust for your Oracle setup
//     });
//     console.log("✅ Connected to Oracle DB");

//   } catch (err) {
//     console.error("❌ Error:", err);
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// }

async function initOracle() {
  try {
    await oracledb.createPool({
      user: "system",
      password: "Broad1234",
      connectString: "localhost:1521/XE",
      poolAlias: 'default' 
    });
    console.log("Oracle DB pool created");
  } catch (err) {
    console.error("Error creating Oracle pool", err);
    process.exit(1);
  }
}

// initOracle();

module.exports = initOracle;


// module.exports = connectToOracle;
const { QueryFile } = require("pg-promise");
const debug = require("debug")("backend:sql");
const fs = require("fs");
const path = require("path");

// Creates SQL Object with queries parsed from folder/sqlFile relationships
function generateQueriesFromRoot() {
  const sqlObject = {};
  const rootFolder = path.resolve(__dirname);
  fs.readdirSync(rootFolder).forEach((folderName) => {
    const folderPath = path.resolve(__dirname, folderName);
    if (folderName === "index.js") {
      return;
    }
    const queryObj = {};
    fs.readdirSync(folderPath).forEach((file) => {
      const sqlQueryName = path.parse(file).name;
      const fullSqlFilePath = path.join(__dirname, folderName, file);
      const qf = new QueryFile(fullSqlFilePath, { minify: true });
      if (qf.error) {
        debug("SQL Query Problem:", qf.error);
      }
      queryObj[sqlQueryName] = qf;
    });
    sqlObject[folderName] = queryObj;
  });
  return sqlObject;
}

const sqlObject = generateQueriesFromRoot();

module.exports = sqlObject;
// SQL Object will look like this:
// const sqlObject = {
//   // external queries for Users:
//   users: {
//       add: sql('users/create.sql'),
//       search: sql('users/search.sql'),
//       report: sql('users/report.sql'),
//   },
//   // external queries for Products:
//   products: {
//       add: sql('products/add.sql'),
//       quote: sql('products/quote.sql'),
//       search: sql('products/search.sql'),
//   }
// };

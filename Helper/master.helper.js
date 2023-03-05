const moment = require("moment");

const validateCsvData = (rows) => {
  const dataRows = rows.slice(1, rows.length); //ignore header at 0 and get rest of the rows
  for (let i = 0; i < dataRows.length; i++) {
    const rowError = validateCsvRow(dataRows[i]);
    if (rowError) {
      return `${rowError} on row ${i + 1}`;
    }
  }
  return false;
};

function validateCsvRow(row) {
  if (!row[0]) {
    return "invalid Asset Name";
  } else if (!Number.isInteger(Number(row[1]))) {
    return "invalid Asset ID";
  } else if (!row[2]) {
    return "Category does not exist";
  }
  //   else if (!moment(row[2], "YYYY-MM-DD").isValid()) {
  //     return "invalid date of birth";
  //   }
  return false;
}

module.exports = { validateCsvData, validateCsvRow };

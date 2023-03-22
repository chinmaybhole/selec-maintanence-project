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
// TODOWe need to add Dynamic Validation based on AddTemp model
function validateCsvRow(row) {
  if (!row[0]) {
    return "invalid Asset Name";
  } else if (!row[1]) {
    return "invalid Description";
  } else if (!row[2]) {
    return "invalid Model name";
  } else if (!row[3]) {
    return "Invalid Area";
  }
  return false;
}

module.exports = { validateCsvData, validateCsvRow };

const mapper = (jsonColumns, excelColumns) => {
  if (jsonColumns.length != excelColumns.length) return false;
  jsonColumns.sort();
  excelColumns.sort();

  const numColumns = jsonColumns.length;
  for (let i = 0; i < numColumns; i++) {
    const jsonColHeader = jsonColumns[i].toLowerCase().trim();
    const excelColHeader = excelColumns[i].toLowerCase().trim();

    if (jsonColHeader !== excelColHeader) return false;
  }

  return true;
};

console.log(mapper(["name", "rollno", "div"], ["name", "rollno", "div"])); //true

console.log(mapper(["name", "rollno ", " div "], ["name", "div", "rollno "])); //true

console.log(mapper(["nAme", "rollNo", "div"], ["name", "Div", "rollno"])); //true

console.log(mapper(["name", "rollno ", " div "], ["name", "rollno "])); //false

console.log(mapper(["nAme", "rollNo ", " div "], ["namee", "Div", "rollno "])); //false

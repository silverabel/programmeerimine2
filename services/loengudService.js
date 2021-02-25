const { SQLPool, getTabeliNimi } = require('../sql');
const tableName = getTabeliNimi('Loeng');

exports.getAll = req => {
  let SQLPäring = 'SELECT * FROM ' + tableName;
  let whereString = '';
  for (const [key, value] of Object.entries(req.query)) {
    whereString += whereString ? `AND ${key} ` : key + ' ';

    if (value === 'null') whereString += ' IS NULL ';
    else if (value) whereString +=  ` = "${value}" `;
  }
  if (whereString) SQLPäring += ' WHERE ' + whereString;

  try {
    return SQLPool.query(SQLPäring);
  }
  catch(error) {
    throw new Error(error);
  }
}

exports.getByID = req => {
  try {
    return SQLPool.query(`SELECT * FROM ${tableName} WHERE ID = ${req.params.id}`);
  }
  catch(error) {
    throw error;
  }
}

exports.post = req => {
  let veerud = '';
  let väärtused = '';
  ['Kommentaar', 'Kuupäev', 'Algusaeg', 'Lõppaeg', 'ÕppeaineID', 'KohtID'].forEach(veerg => {
    if (req.body[veerg]) {
      veerud += veerud ? ', ' + veerg : veerg;
      väärtus = `"${req.body[veerg]}"`;
      väärtused += väärtused ? ', ' + väärtus : väärtus;
    }
  });

  try {
    return SQLPool.query(`INSERT INTO ${tableName} (${veerud}) VALUES (${väärtused})`);
  }
  catch(error) {
    throw error;
  }
}

exports.deleteByID = req => {
  try {
    return SQLPool.query(`DELETE FROM ${tableName} WHERE ID = ${req.params.id}`);
  }
  catch(error) {
    throw error;
  }
}

exports.patchByID = (req, values) => {
  try {
    return SQLPool.query(`UPDATE ${tableName} SET ${values} WHERE ID = ${req.params.id}`);
  }
  catch(error) {
    throw error;
  }
}
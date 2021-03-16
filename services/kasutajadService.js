const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { SQLPool, getTabeliNimi } = require('../sql');
const tableName = getTabeliNimi('Kasutaja');

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

exports.create = async req => {
  try {
    const existingUser = await SQLPool.query(`SELECT ID FROM ${tableName} WHERE Email = "${req.body.Email}"`);
    if (existingUser[0]) throw 'Sellise emailiga kasutaja on juba olemas';
  }
  catch (error) {
    throw error;
  }

  req.body.Password = await bcrypt.hash(req.body.Password, 10);

  let veerud = '';
  let väärtused = '';
  ['Email', 'Password', 'RollID'].forEach(veerg => {
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

exports.login = async reqBody => {
  try {
    var userData = await SQLPool.query(`SELECT password, rollID FROM ${tableName} WHERE Email = "${reqBody.Email}"`);
    if (!userData[0]) throw 'Sellise emailiga kasutajat ei leitud';
  }
  catch (error) {
    throw error;
  }
  
  if (!await bcrypt.compare(reqBody.Password, userData[0].password)) throw 'Vale parool';

  return await jsonwebtoken.sign({roleID: userData[0].rollID}, jwtSecret, {expiresIn: 60 * 60});
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
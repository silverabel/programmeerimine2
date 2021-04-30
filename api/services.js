const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { SQLPool, getTabeliNimi } = require('../sql');

exports.getAll = (tableName, req) => {
  let SQLPäring = 'SELECT * FROM ' + getTabeliNimi(tableName);
  let whereString = '';
  let values = [];
  for (const [key, value] of Object.entries(req.query)) {
    whereString += whereString ? `AND ${key}` : key;

    if (value === 'null') whereString += ' IS NULL ';
    else if (value) {
      whereString +=  ` = ? `;
      values.push(value)
    }
  }
  if (whereString) SQLPäring += ' WHERE ' + whereString;

  try {
    return SQLPool.query(SQLPäring, values);
  }
  catch(error) {
    throw error;
  }
}

exports.getByID = (tableName, req) => {
  try {
    return SQLPool.query(`SELECT * FROM ${getTabeliNimi(tableName)} WHERE ID = ?`, [req.params.id]);
  }
  catch(error) {
    throw error;
  }
}

const possibleFields = {
  Kursus: ['Nimi', 'Kood', 'Number'],
  Loeng: ['Kommentaar', 'Kuupäev', 'Algusaeg', 'Lõppaeg', 'ÕppeaineID', 'KohtID'],
  Õppeaine: ['Nimi', 'Kood', 'Maht', 'ÕppejõudID'],
  Õppejõud: ['Nimi'],
};

exports.post = (tableName, req) => {
  let values = {};
  possibleFields[tableName].forEach(field => {
    if (req.body[field]) {
      values[field] = req.body[field];
    }
  });
  
  try {
    return SQLPool.query(`INSERT INTO ${getTabeliNimi(tableName)} SET ?`, values);
  }
  catch(error) {
    throw error;
  }
}

exports.create = async (tableName, req) => {
  try {
    const existingUser = await SQLPool.query(`SELECT ID FROM ${getTabeliNimi(tableName)} WHERE Email = ?`, req.body.Email);
    if (existingUser[0]) throw 'Sellise emailiga kasutaja on juba olemas';
  }
  catch (error) {
    throw error;
  }

  req.body.Password = await bcrypt.hash(req.body.Password, 10);

  let values = {};
  ['Email', 'Password', 'RollID'].forEach(field => {
    if (req.body[field]) {
      values[field] = req.body[field];
    }
  });

  try {
    return SQLPool.query(`INSERT INTO ${getTabeliNimi(tableName)} SET ?`, values);
  }
  catch(error) {
    throw error;
  }
}

exports.login = async (tableName, reqBody) => {
  try {
    var userData = await SQLPool.query(`SELECT password, rollID FROM ${getTabeliNimi(tableName)} WHERE Email = ?`, reqBody.Email);
    if (!userData[0]) throw 'Sellise emailiga kasutajat ei leitud';
  }
  catch (error) {
    throw error;
  }
  
  if (!await bcrypt.compare(reqBody.Password, userData[0].password)) throw 'Vale parool';

  return await jsonwebtoken.sign({roleID: userData[0].rollID}, jwtSecret, {expiresIn: 60 * 60});
}

exports.deleteByID = (tableName, req) => {
  try {
    return SQLPool.query(`DELETE FROM ${getTabeliNimi(tableName)} WHERE ID = ?`, [req.params.id]);
  }
  catch(error) {
    throw error;
  }
}

exports.patchByID = (tableName, id, values) => {
  try {
    return SQLPool.query(`UPDATE ${getTabeliNimi(tableName)} SET ? WHERE ID = ?`, [values, id]);
  }
  catch(error) {
    throw error;
  }
}
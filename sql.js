const { sqllogin, tablePrefix } = require('./config');
const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool(sqllogin);
pool.query = util.promisify(pool.query);

exports.SQLPool = pool;

exports.getTabeliNimi = function(tabeliNimi) {
  return tablePrefix + tabeliNimi;
}
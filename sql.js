const mysql = require('mysql');

const { sqllogin } = require('./config');
const pool = mysql.createPool(sqllogin);

exports.sql = function(query, onData, onError) {
  try {
    pool.query(query, function(error, results, fields) {
      error ? onError(error) : onData(results);
    });
  }
  catch (error) {
    if (onError !== undefined) onError(error);
  };
};

exports.getTabeliNimi = function(tabeliNimi) {
  return 'Prog2_' + tabeliNimi;
}
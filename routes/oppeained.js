const { sql, getTabeliNimi } = require('../sql');
const express = require('express');
const router = express.Router();

const õppeaineTabel = getTabeliNimi('Õppeaine');

router.get('', (req, res) => {
  let SQLPäring = 'SELECT * FROM ' + õppeaineTabel;
  let whereString = '';
  for (const [key, value] of Object.entries(req.query)) {
    whereString += whereString ? `AND ${key} ` : key + ' ';

    if (value === 'null') whereString += ' IS NULL ';
    else if (value) whereString +=  ` = "${value}" `;
  }
  SQLPäring += whereString ? ' WHERE ' + whereString : '';

  sql(SQLPäring, result => {
    result[0] ? res.status(200).json(result) : res.status(404).json({"message": "Not found"});
  }, viga => {
    res.status(500).json({"Sõnum": "Viga päringus", viga});
  });
});

router.get('/:id', (req, res) => {
  sql(`SELECT * FROM ${õppeaineTabel} WHERE ID = ${req.params.id}`, result => {
    result[0] ? res.status(200).json(result[0]) : res.status(404).json({"message": "Not found"});
  }, viga => {
    res.status(500).json({"Sõnum": "Viga päringus", viga});
  });
});

router.post('', (req, res) => {
  let viga = '';
  viga += !req.body.Nimi ? 'Nimi puudu; ' : '';
  viga += !req.body.Kood ? 'Kood puudu; ' : '';
  viga += req.body.Maht && isNaN(req.body.Maht) ? 'Maht peab olema number' : '';
  if (viga) {
    res.status(500).json({"Sõnum": "Viga andmetes", viga});
    return;
  }
  
  let veerud = '';
  let väärtused = '';
  ['Nimi', 'Kood', 'Maht', 'ÕppejõudID'].forEach(veerg => {
    if (req.body[veerg]) {
      veerud += veerud ? ', ' + veerg : veerg;
      väärtus = `"${req.body[veerg]}"`;
      väärtused += väärtused ? ', ' + väärtus : väärtus;
    }
  });

  sql(`INSERT INTO ${õppeaineTabel} (${veerud}) VALUES (${väärtused})`, result => {
    res.status(201).json({"ID": result.insertId});
  }, viga => {
    res.status(500).json({"Sõnum": "Viga päringus", viga});
  });
});

module.exports = router;
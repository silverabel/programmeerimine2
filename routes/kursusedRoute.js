const { sql, getTabeliNimi } = require('../sql');
const express = require('express');
const router = express.Router();

const kursusTabel = getTabeliNimi('Kursus');


router.get('', (req, res) => {
  let SQLPäring = 'SELECT * FROM ' + kursusTabel;
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
  sql(`SELECT * FROM ${kursusTabel} WHERE ID = ${req.params.id}`, result => {
    result[0] ? res.status(200).json(result[0]) : res.status(404).json({"message": "Not found"});
  }, viga => {
    res.status(500).json({"Sõnum": "Viga päringus", viga});
  });
});

router.post('', (req, res) => {
  let viga = '';
  if (!req.body.Nimi)         viga += 'Nimi puudu; ';
  if (!req.body.Kood)         viga += 'Kood puudu; ';
  if (!req.body.Number)       viga += 'Number puudu; ';
  if (isNaN(req.body.Number)) viga += 'Kursusenumber peab olema number';
  if (viga) return res.status(500).json({"Sõnum": "Viga andmetes", viga});
  
  let veerud = '';
  let väärtused = '';
  ['Nimi', 'Kood', 'Number'].forEach(veerg => {
    if (req.body[veerg]) {
      veerud += veerud ? ', ' + veerg : veerg;
      väärtus = `"${req.body[veerg]}"`;
      väärtused += väärtused ? ', ' + väärtus : väärtus;
    }
  });

  sql(`INSERT INTO ${kursusTabel} (${veerud}) VALUES (${väärtused})`, result => {
    res.status(201).json({"ID": result.insertId});
  }, viga => {
    res.status(500).json({"Sõnum": "Viga päringus", viga});
  });
});

router.delete('/:id', (req, res) => {
  sql(`DELETE FROM ${kursusTabel} WHERE ID = ${req.params.id}`, result => {
    result.affectedRows ? res.status(200).json({"Sõnum": `Kursus ID-ga ${req.params.id} edukalt kustutatud`}) 
                        : res.status(404).json({"Sõnum": "Sellise ID-ga kursust ei leitud"});
  }, viga => {
    res.status(500).json({"Sõnum": "Viga päringus", viga});
  });
});

router.patch('/:id', (req, res) => {
  let viga = '';
  if (req.body.Number && isNaN(req.body.Number)) viga += 'Kursusenumber peab olema number';
  if (viga) {
    res.status(500).json({"Sõnum": "Viga andmetes", viga});
    return;
  }

  väärtused = '';
  ['Nimi', 'Kood', 'Number'].forEach(veerg => {
    if (req.body[veerg]) {
      if (väärtused) väärtused += ', ';
      väärtused += `${veerg} = "${req.body[veerg]}"`;
    }
  });

  if (!väärtused) return res.status(500).json({"Sõnum": "Ei leitud andmeid, mida uuendada"});

  sql(`UPDATE ${kursusTabel} SET ${väärtused} WHERE ID = ${req.params.id}`, result => {
    result.affectedRows ? res.status(200).json({"Sõnum": `Kursuse ID-ga ${req.params.id} andmed edukalt uuendatud`})
                         : res.status(404).json({"Sõnum": "Sellise ID-ga kursust ei leitud"});
  }, viga => {
    res.status(500).json({"Sõnum": "Viga päringus", viga});
  });
});

module.exports = router;
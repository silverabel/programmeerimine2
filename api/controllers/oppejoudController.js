const service = require('../services');
const tableName = 'Õppejõud';

exports.getAll = async (req, res) => {
  try {
    let result = await service.getAll(tableName, req);
    result[0] ? res.status(200).json({"result": result}) : res.status(404).json({"Message": "Not found"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.getByID = async (req, res) => {
  try {
    let result = await service.getByID(tableName, req);
    result[0] ? res.status(200).json({"result": result[0]}) : res.status(404).json({"Message": "Not found"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.post = async (req, res) => {
  let viga = '';
  if (!req.body.Nimi) viga += 'Nimi puudu; ';
  if (viga) return res.status(500).json({"Sõnum": "Viga andmetes", viga});
  
  try {
    let result = await service.post(tableName, req);
    res.status(201).json({"ID": result.insertId});
  }
  catch(error) {
    res.status(500).json(error);
  }
    
}

exports.deleteByID = async (req, res) => {
  try {
    let result = await service.deleteByID(tableName, req);
    result.affectedRows ? res.status(200).json({"Sõnum": `Õppejõud ID-ga ${req.params.id} edukalt kustutatud`}) 
                        : res.status(404).json({"Sõnum": "Sellise ID-ga õppejõudu ei leitud"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.patchByID = async (req, res) => {
  väärtused = {};
  ['Nimi'].forEach(veerg => {
    if (req.body[veerg]) väärtused[veerg] = req.body[veerg];
  });

  if (väärtused === {}) return res.status(500).json({"Sõnum": "Ei leitud andmeid, mida uuendada"});

  try {
    let result = await service.patchByID(tableName, req.params.id, väärtused);
    result.affectedRows ? res.status(200).json({"Sõnum": `Õppejõud ID-ga ${req.params.id} andmed edukalt uuendatud`})
                        : res.status(404).json({"Sõnum": "Sellise ID-ga õppejõudu ei leitud"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}
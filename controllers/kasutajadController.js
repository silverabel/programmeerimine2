const service = require('../services/kasutajadService');

exports.getAll = async (req, res) => {
  try {
    let result = await service.getAll(req);
    result[0] ? res.status(200).json({"result": [result]}) : res.status(404).json({"Message": "Not found"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.getByID = async (req, res) => {
  try {
    let result = await service.getByID(req);
    result[0] ? res.status(200).json({"result": [result]}) : res.status(404).json({"Message": "Not found"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.create = async (req, res) => {
  let viga = '';
  if (!req.body.Email)            viga += 'Email puudu; ';
  if (!req.body.Password)         viga += 'Password puudu; ';
  if (!req.body.RollID)           viga += 'RollID puudu; ';
  if (viga) return res.status(500).json({"Sõnum": "Viga andmetes", viga});
  
  try {
    let result = await service.create(req);
    res.status(201).json({"ID": result.insertId});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.login = async (req, res) => {
  let viga = '';
  if (!req.body.Email)            viga += 'Email puudu; ';
  if (!req.body.Password)         viga += 'Password puudu; ';
  if (viga) return res.status(500).json({"Sõnum": "Viga andmetes", viga});

  try {
    let result = await service.login(req.body);
    res.status(200).json({"token": result});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.deleteByID = async (req, res) => {
  try {
    let result = await service.deleteByID(req);
    result.affectedRows ? res.status(200).json({"Sõnum": `Kursus ID-ga ${req.params.id} edukalt kustutatud`}) 
                        : res.status(404).json({"Sõnum": "Sellise ID-ga kursust ei leitud"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.patchByID = async (req, res) => {
  let viga = '';
  if (req.body.RollID && isNaN(req.body.RollID)) viga += 'RollID peab olema number';
  if (viga) return res.status(500).json({"Sõnum": "Viga andmetes", viga});

  väärtused = '';
  ['Email', 'Password', 'RollID'].forEach(veerg => {
    if (req.body[veerg]) {
      if (väärtused) väärtused += ', ';
      väärtused += `${veerg} = "${req.body[veerg]}"`;
    }
  });

  if (!väärtused) return res.status(500).json({"Sõnum": "Ei leitud andmeid, mida uuendada"});

  try {
    let result = await service.patchByID(req, väärtused);
    result.affectedRows ? res.status(200).json({"Sõnum": `Kursus ID-ga ${req.params.id} andmed edukalt uuendatud`})
                        : res.status(404).json({"Sõnum": "Sellise ID-ga kursust ei leitud"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}
const { sql, getTabeliNimi } = require('../sql');
const oppeainedService = require('../services/oppeainedService');
const õppeaineTabel = getTabeliNimi('Õppeaine');

exports.getAll = async (req, res) => {
  try {
    let result = await oppeainedService.getAll(req);
    result[0] ? res.status(200).json({"result": [result]}) : res.status(404).json({"Message": "Not found"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.getByID = async (req, res) => {
  try {
    let result = await oppeainedService.getByID(req);
    result[0] ? res.status(200).json({"result": [result]}) : res.status(404).json({"Message": "Not found"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.post = async (req, res) => {
  let viga = '';
  if (!req.body.Nimi)                        viga += 'Nimi puudu; ';
  if (!req.body.Kood)                        viga += 'Kood puudu; ';
  if (req.body.Maht && isNaN(req.body.Maht)) viga += 'Maht peab olema number';
  if (viga) return res.status(500).json({"Sõnum": "Viga andmetes", viga});
  
  try {
    let result = await oppeainedService.post(req);
    res.status(201).json({"ID": result.insertId});
  }
  catch(error) {
    res.status(500).json(error);
  }
    
}

exports.deleteByID = async (req, res) => {
  try {
    let result = await oppeainedService.deleteByID(req);
    result.affectedRows ? res.status(200).json({"Sõnum": `Õppeaine ID-ga ${req.params.id} edukalt kustutatud`}) 
                        : res.status(404).json({"Sõnum": "Sellise ID-ga õppeainet ei leitud"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.patchByID = async (req, res) => {
  let viga = '';
  if (req.body.Maht && isNaN(req.body.Maht)) viga += 'Maht peab olema number';
  if (viga) return res.status(500).json({"Sõnum": "Viga andmetes", viga});

  väärtused = '';
  ['Nimi', 'Kood', 'Maht', 'ÕppejõudID'].forEach(veerg => {
    if (req.body[veerg]) {
      if (väärtused) väärtused += ', ';
      väärtused += `${veerg} = "${req.body[veerg]}"`;
    }
  });

  if (!väärtused) return res.status(500).json({"Sõnum": "Ei leitud andmeid, mida uuendada"});

  try {
    let result = await oppeainedService.patchByID(req, väärtused);
    result.affectedRows ? res.status(200).json({"Sõnum": `Õppeaine ID-ga ${req.params.id} andmed edukalt uuendatud`})
                        : res.status(404).json({"Sõnum": "Sellise ID-ga õppeainet ei leitud"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}


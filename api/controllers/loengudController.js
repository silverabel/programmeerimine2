const service = require('../services');
const tableName = 'Loeng';

exports.getAll = async (req, res) => {
  try {
    let result = await service.getAll(tableName, req);
    result[0] ? res.status(200).json({"result": [result]}) : res.status(404).json({"Message": "Not found"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.getByID = async (req, res) => {
  try {
    let result = await service.getByID(tableName, req);
    result[0] ? res.status(200).json({"result": [result]}) : res.status(404).json({"Message": "Not found"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.post = async (req, res) => {
  let viga = '';
  if (!req.body.Kuupäev)                         viga += 'Kuupäev puudu; ';
  if (!req.body.Algusaeg)                        viga += 'Algusaeg puudu; ';
  if (!req.body.Lõppaeg)                         viga += 'Lõppaeg puudu; ';
  if (!req.body.ÕppeaineID)                      viga += 'ÕppeaineID puudu; ';
  if (isNaN(req.body.ÕppeaineID))                viga += 'ÕppeaineID peab olema number; ';
  if (req.body.KohtID && isNaN(req.body.KohtID)) viga += 'KohtID peab olema number; ';
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
    result.affectedRows ? res.status(200).json({"Sõnum": `Loeng ID-ga ${req.params.id} edukalt kustutatud`}) 
                        : res.status(404).json({"Sõnum": "Sellise ID-ga loengut ei leitud"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}

exports.patchByID = async (req, res) => {
  let viga = '';
  if (req.body.ÕppeaineID && isNaN(req.body.ÕppeaineID)) viga += 'ÕppeaineID peab olema number; ';
  if (req.body.KohtID && isNaN(req.body.KohtID))         viga += 'KohtID peab olema number; ';
  if (viga) return res.status(500).json({"Sõnum": "Viga andmetes", viga});

  väärtused = '';
  ['Kommentaar', 'Kuupäev', 'Algusaeg', 'Lõppaeg', 'ÕppeaineID', 'KohtID'].forEach(veerg => {
    if (req.body[veerg]) {
      if (väärtused) väärtused += ', ';
      väärtused += `${veerg} = "${req.body[veerg]}"`;
    }
  });

  if (!väärtused) return res.status(500).json({"Sõnum": "Ei leitud andmeid, mida uuendada"});

  try {
    let result = await service.patchByID(tableName, req.params.id, väärtused);
    result.affectedRows ? res.status(200).json({"Sõnum": `Loeng ID-ga ${req.params.id} andmed edukalt uuendatud`})
                        : res.status(404).json({"Sõnum": "Sellise ID-ga loengut ei leitud"});
  }
  catch(error) {
    res.status(500).json({error});
  }
}
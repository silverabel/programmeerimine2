const express = require('express');
const app = express();

app.use(express.json());

let vabandused = [
  {
    id: 1,
    description: 'Ei tahtnud teha'
  },
  {
    id: 2,
    description: 'Ei osanud teha'
  }
];

app.get('/hello', (req, res) => {
  res.status(200).json({message: 'Herro'});
});

app.get('/vabandused', (req, res) => {
  res.status(200).json({
    vabandused
  });
});

app.get('/vabandused/:id', (req, res) => {
  let vabandus = vabandused.find(vabandus => vabandus.id == req.params.id);
  vabandus ? res.status(200).json({vabandus: vabandus.description}) : res.status(404).json({message: 'Not found'});
});

app.post('/vabandused', (req, res) => {
  const description = req.body.description;
  vabandused.push({id: vabandused.length + 1, description});
  res.status(201).json({message: 'success'});
});

app.delete('/vabandused/:id', (req, res) => {
  vabandused = vabandused.filter(vabandus => vabandus.id != req.params.id);
  res.status(200).json({message: 'Kustutatud'});
});

app.patch('/vabandused/:id', (req, res) => {
  const description = req.body.description;
  vabandused = vabandused.map(function(vabandus) {
    if (vabandus.id == this.id) vabandus.description = description;
    return vabandus;
  }, req.params);
  res.status(200).json({message: 'Success'});
});

app.listen(3000, () => console.log('Server go brr'));
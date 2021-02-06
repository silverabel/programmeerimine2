const express = require('express');
const app = express();

const vabandused = [
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

app.listen(3000, () => console.log('Server go brr'));
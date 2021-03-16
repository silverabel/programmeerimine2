const { port } = require('./config');
const express = require('express');
const app = express();

app.use(express.json());

const { oppeainedRoute, oppejoudRoute, kursusedRoute, loengudRoute, kasutajadRoute } = require('./routes');

app
  .use('/oppeained', oppeainedRoute)
  .use('/oppejoud', oppejoudRoute)
  .use('/kursused', kursusedRoute)
  .use('/loengud', loengudRoute)
  .use('/kasutajad', kasutajadRoute);

app.listen(port, () => console.log('Listening to port ' + port));
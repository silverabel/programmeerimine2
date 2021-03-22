const express = require('express');
const app = express();

app.use(express.json());

const { oppeainedRoute, oppejoudRoute, kursusedRoute, loengudRoute, kasutajadRoute } = require('./api/routes');

app
  .use('/oppeained', oppeainedRoute)
  .use('/oppejoud', oppejoudRoute)
  .use('/kursused', kursusedRoute)
  .use('/loengud', loengudRoute)
  .use('/kasutajad', kasutajadRoute);

const port = process.env.PORT || 80;
app.listen(port, () => console.log('Listening to port ' + port));
const { port } = require('./config');
const express = require('express');

const oppeainedRoute = require('./routes/oppeained');
const oppejoudRoute = require('./routes/oppejoud');
const kursusedRoute = require('./routes/kursused');
const loengudRoute = require('./routes/loengud');

const app = express();
app.use(express.json());

app.use('/oppeained', oppeainedRoute);
app.use('/oppejoud', oppejoudRoute);
app.use('/kursused', kursusedRoute);
app.use('/loengud', loengudRoute);

app.listen(port, () => console.log('Listening to port ' + port));
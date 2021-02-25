const { port } = require('./config');
const express = require('express');
const app = express();
app.use(express.json());

const oppeainedRoute = require('./routes/oppeainedRoute');
const oppejoudRoute = require('./routes/oppejoudRoute');
const kursusedRoute = require('./routes/kursusedRoute');
const loengudRoute = require('./routes/loengudRoute');
app.use('/oppeained', oppeainedRoute);
app.use('/oppejoud', oppejoudRoute);
app.use('/kursused', kursusedRoute);
app.use('/loengud', loengudRoute);

app.listen(port, () => console.log('Listening to port ' + port));
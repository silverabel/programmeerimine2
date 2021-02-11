const express = require('express');

const oppeainedRoute = require('./routes/oppeained');

const app = express();
app.use(express.json());

app.use('/oppeained', oppeainedRoute);

app.listen(80, () => console.log('Server go brr'));
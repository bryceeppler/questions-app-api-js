const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

const api = require('./api');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


app.get('/', (req, res) => {
  // return 200 OK
  res.status(200).send('Connected!');
});

app.use('/api/v1', api);

module.exports = app;

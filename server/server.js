const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const app = express();

require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(process.env.PORT || 5000, () => console.log('Server running...'));

const express = require('express');
const axios = require('axios').default;
const io = require('socket.io')();
const cors = require('cors');
const logger = require('morgan');
const url = require('url');

const app = express();

require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', socket => {
  console.log('New client connected');

  setInterval(() => {
    const cities = ['jeddah', 'dammam', 'mecca', 'jizan'];
    const chosen = cities[Math.floor(Math.random() * 3)];

    sendWeatherData(socket, chosen);
  }, 10000);
});

const sendWeatherData = async (socket, city) => {
  const apiUrl = url.format({
    protocol: 'https',
    hostname: process.env.API_URL,
    query: {
      q: city,
      lang: 'ar',
      format: 'json',
      key: process.env.API_KEY,
      num_of_days: 1,
    },
  });

  try {
    const response = await axios.get(apiUrl);
    const { current_condition, request } = response.data.data;
    socket.emit('weather_data', { current_condition, city: request[0].query });
  } catch (error) {
    console.log(error.response.data);
  }
};

const server = app.listen(process.env.PORT || 5000, () =>
  console.log('Server running...')
);

io.attach(server);

const path = require('path');
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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

io.on('connection', socket => {
  console.log('New client connected');

  const city = socket.handshake.query['city'];

  let defaultCity = city !== '' ? city : 'الرياض';
  const timeToUpdate = 600000; // 10 minutes

  // Send weather data for the first time after establishing the connection
  sendWeatherData(socket, defaultCity);

  // Event to handle specific city requests from the client
  socket.on('send me weather data', city => {
    sendWeatherData(socket, city);
    defaultCity = city;
  });

  // Keep sending real-time weather data every for every specificed period
  setInterval(() => {
    sendWeatherData(socket, defaultCity);
  }, timeToUpdate);
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
    const { data } = response.data;

    if (data) {
      let dataToBeSent = '';
      if (data.error) {
        dataToBeSent = {
          error: data.error[0].msg,
        };
      } else {
        const { request, current_condition, weather } = response.data.data;
        dataToBeSent = {
          current_condition: current_condition[0],
          weather: weather[0],
          city: request[0].query,
        };
      }

      socket.emit('get weather data', dataToBeSent);
    }
  } catch (error) {
    socket.disconnect();
  }
};

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on http://localhost:${5000}`)
);

io.attach(server);

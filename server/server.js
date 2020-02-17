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

io.on('connection', socket => {
  console.log('New client connected');

  // const query = socket.handshake.query;

  let defaultCity = 'riyadh';

  // Send weather data for the first time after establishing the connection
  // sendWeatherData(socket, defaultCity);

  // Event to handle specific city requests from the client
  socket.on('send me weather data', city => {
    sendWeatherData(socket, city);
    defaultCity = city;
  });

  // Keep sending real-time weather data every 1 minute
  // setInterval(() => {
  //   sendWeatherData(socket, defaultCity);
  // }, 60000);
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
        const { current_condition, request } = response.data.data;
        dataToBeSent = {
          current_condition,
          city: request[0].query,
        };
      }

      socket.emit('get weather data', dataToBeSent);
    }
  } catch (error) {
    console.log(error.response.data);
  }
};

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on http://localhost:${5000}`)
);

io.attach(server);

import React, { Component } from 'react';
import moment from './config/moment';
import { localize } from './config/localizedTime';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
} from 'reactstrap';
import CityInputForm from './components/CityInputForm';
import io from 'socket.io-client';
import './App.css';

class App extends Component {
  state = {
    socket: null,
    chosenCity: '',
    currentCondition: {},
  };

  componentDidMount() {
    // Establish a new socket.io connection
    const socket = io('http://localhost:5000');
    this.setState({
      socket,
    });

    // This is where you will listen to events coming from socket.io server
    socket.on('get weather data', data => {
      if (!data.error) {
        const {
          temp_C,
          // temp_F,
          weatherIconUrl,
          lang_ar,
          windspeedKmph,
          winddirDegree,
        } = data.current_condition;

        const { city } = data;

        const {
          maxtempC,
          // maxtempF,
          mintempC,
          // mintempF,
          astronomy,
        } = data.weather;

        this.setState({
          currentCondition: {
            lastUpdate: moment(),
            temp_C,
            maxtempC,
            mintempC,
            // temp_F,
            weatherIcon: weatherIconUrl ? weatherIconUrl[0].value : '',
            weatherStatus: lang_ar ? lang_ar[0].value : '',
            windSpeed: windspeedKmph,
            windDirection: winddirDegree,
            sunrise: astronomy ? localize(astronomy[0].sunrise) : '',
            sunset: astronomy ? localize(astronomy[0].sunset) : '',
          },

          chosenCity: city,
        });
      }
      console.log(data);
    });
  }

  updateCity = city => {
    const { socket } = this.state;
    if (socket) {
      socket.emit('send me weather data', city);
    }
  };

  render() {
    const {
      lastUpdate,
      temp_C,
      maxtempC,
      mintempC,
      weatherIcon,
      weatherStatus,
      windSpeed,
      windDirection,
      sunrise,
      sunset,
    } = this.state.currentCondition;
    const { chosenCity } = this.state;

    return (
      <Container>
        <Row className="justify-content-center">
          <Col className="col-md-10 col-lg-8">
            <Card className="p-3" color="light">
              <CardHeader>
                <h3 className="text-center mt-3">
                  مرحباً بك في تطبيق الطقس في الزمن الحقيقي
                </h3>
                <CityInputForm updateCity={this.updateCity} />
              </CardHeader>
              <CardBody className="text-center">
                <Card>
                  <CardBody>
                    <Card className="text-white" color="info">
                      <small className="text-right mr-1">
                        آخر تحديث:{' '}
                        {lastUpdate ? lastUpdate.format('h:mm a') : ''}
                      </small>
                      <CardBody>
                        <CardTitle tag="h3">{chosenCity}</CardTitle>
                        <CardSubtitle>
                          <em>{weatherStatus}</em>
                          <img
                            src={weatherIcon}
                            alt=""
                            className="weather-icon mx-2"
                          />
                        </CardSubtitle>
                        <div className="mt-2">
                          <div>
                            <span>درجة الحرارة: &#8451;{temp_C} </span>
                          </div>
                          <div className="info-grid">
                            <span>درجة الحرارة العظمى: &#8451;{maxtempC}</span>
                            <span>درجة الحرارة الدنيا: &#8451;{mintempC}</span>
                            <span>سرعة الرياح: {windSpeed} كم/س</span>
                            <span>اتجاه الرياح: {windDirection} درجة</span>
                            <span>شروق الشمس: {sunrise}</span>
                            <span>غروب الشمس: {sunset}</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;

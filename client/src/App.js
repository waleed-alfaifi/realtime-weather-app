import React, { Component } from 'react';
import moment from './config/moment';

import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  Spinner,
  Alert,
} from 'reactstrap';
import CityInputForm from './components/CityInputForm';
import io from 'socket.io-client';
import { localize } from './config/localizedTime';
import { toHTTPs } from './config/convertToHTTPs';
import { setItem, getItem } from './config/storage';
import './App.css';

class App extends Component {
  state = {
    socket: null,
    chosenCity: '',
    currentCondition: {},
    isFehrenheit: false,
    isLoading: false,
    alert: {
      show: false,
      alertType: '',
      alertMessage: '',
    },
  };

  componentDidMount() {
    // Get stored city in local storage to send it with the socket.io connection
    let storedCity = getItem('city');

    // Establish a new socket.io connection and store it in state
    const socket = io('', {
      query: {
        city: storedCity ? storedCity : '',
      },
    });
    this.setState({ socket });

    this.getWeatherData(socket);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isFehrenheit !== prevState.isFehrenheit) {
      const { isFehrenheit } = this.state;
      const {
        temp_C,
        temp_F,
        mintempC,
        maxtempC,
        mintempF,
        maxtempF,
      } = this.state.currentCondition;
      this.setState({
        currentCondition: {
          ...prevState.currentCondition,
          temp: isFehrenheit ? temp_F : temp_C,
          maxtemp: isFehrenheit ? maxtempF : maxtempC,
          mintemp: isFehrenheit ? mintempF : mintempC,
        },
      });
    }
  }

  getWeatherData = socket => {
    if (!socket) return;
    this.setState({ isLoading: true });

    // This is where you will listen to events carrying weather data coming from socket.io server
    socket.on('get weather data', data => {
      this.setState({ isLoading: true });

      if (!data.error) {
        const { isFehrenheit } = this.state;

        const {
          temp_C,
          temp_F,
          weatherIconUrl,
          lang_ar,
          windspeedKmph,
          winddirDegree,
        } = data.current_condition;

        const { city } = data;

        const {
          maxtempC,
          maxtempF,
          mintempC,
          mintempF,
          astronomy,
        } = data.weather;

        this.setState({
          currentCondition: {
            lastUpdate: moment(),
            temp_C,
            temp_F,
            mintempC,
            maxtempC,
            mintempF,
            maxtempF,
            temp: isFehrenheit ? temp_F : temp_C,
            maxtemp: isFehrenheit ? maxtempF : maxtempC,
            mintemp: isFehrenheit ? mintempF : mintempC,
            weatherIcon: weatherIconUrl ? toHTTPs(weatherIconUrl[0].value) : '',
            weatherStatus: lang_ar ? lang_ar[0].value : '',
            windSpeed: windspeedKmph,
            windDirection: winddirDegree,
            sunrise: astronomy ? localize(astronomy[0].sunrise) : '',
            sunset: astronomy ? localize(astronomy[0].sunset) : '',
          },
          chosenCity: city,
        });

        // Update local storage
        setItem('city', city);

        this.setState({ isLoading: false });
        this.setState({
          alert: {
            alertType: '',
            alertMessage: '',
          },
        });
      } else {
        // If there is an error in the returned data, handle it here
        this.setState({
          alert: {
            alertType: 'danger',
            alertMessage: 'لا يوجد مدينة بهذا الاسم. حاول إدخال مدينة أخرى.',
          },
        });
      }
      this.setState({ isLoading: false });
    });
  };

  updateCity = city => {
    const { socket } = this.state;
    if (socket) {
      this.setState({ isLoading: true });
      socket.emit('send me weather data', city);
    }
  };

  updateTempType = e => {
    const { value } = e.target;
    this.setState({
      isFehrenheit: value === 'F' ? true : false,
    });
  };

  renderIsLoading = () => {
    return this.state.isLoading ? (
      <Spinner size="sm" color="light" className="mr-1" />
    ) : (
      ''
    );
  };

  renderAlert = () => {
    const {
      alert: { alertType, alertMessage },
    } = this.state;

    const onDismiss = () => {
      this.setState({
        alert: {
          alertType: '',
          alertMessage: '',
        },
      });
    };

    return alertType !== '' ? (
      <Alert
        color={alertType}
        className="mt-2"
        isOpen={alertType !== ''}
        toggle={onDismiss}
      >
        {alertMessage}
      </Alert>
    ) : (
      ''
    );
  };

  render() {
    const {
      lastUpdate,
      temp,
      maxtemp,
      mintemp,
      weatherIcon,
      weatherStatus,
      windSpeed,
      windDirection,
      sunrise,
      sunset,
    } = this.state.currentCondition;
    const { chosenCity } = this.state;

    const { isFehrenheit } = this.state;
    const tempType = isFehrenheit ? 'F' : 'C';

    const tempSymbol = () => {
      return {
        __html: isFehrenheit ? '&#8457;' : '&#8451;',
      };
    };

    return (
      <Container>
        <Row className="justify-content-center">
          <Col className="col-md-10 col-lg-8">
            <Card className="p-3" color="light">
              <CardHeader>
                <h3 className="text-center mt-3">
                  مرحباً بك في تطبيق الطقس في الزمن الحقيقي
                </h3>
                <CityInputForm
                  updateCity={this.updateCity}
                  updateTempType={this.updateTempType}
                  tempType={tempType}
                />
              </CardHeader>
              {this.renderAlert()}
              <CardBody className="text-center">
                <Card>
                  <CardBody>
                    <Card className="text-white" color="info">
                      <small className="text-right">
                        {this.renderIsLoading()}
                        <span className="mr-1">
                          آخر تحديث:{' '}
                          {lastUpdate ? lastUpdate.format('h:mm a') : ''}
                        </span>
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
                            <span>
                              درجة الحرارة:{' '}
                              <span dangerouslySetInnerHTML={tempSymbol()} />
                              {temp}
                            </span>
                          </div>
                          <div className="info-grid">
                            <span>
                              درجة الحرارة العظمى:{' '}
                              <span dangerouslySetInnerHTML={tempSymbol()} />
                              {maxtemp}
                            </span>
                            <span>
                              درجة الحرارة الدنيا:{' '}
                              <span dangerouslySetInnerHTML={tempSymbol()} />
                              {mintemp}
                            </span>
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

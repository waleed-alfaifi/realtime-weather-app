import React, { Component } from 'react';
import moment from 'moment';
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
    chosenCity: null,
    currentCondition: undefined,
  };

  componentDidMount() {
    // Establish a new socket.io connection
    const socket = io('http://localhost:5000');
    this.setState({
      socket,
    });

    // This is where you will listen to events coming from socket.io server
    // socket.on('get weather data', data => {
    //   console.log(data);
    // });
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col className="col-md-10 col-lg-8">
            <Card className="p-3" color="light">
              <CardHeader>
                <h3 className="text-center mt-3">
                  مرحباً بك في تطبيق الطقس في الزمن الحقيقي
                </h3>
                <CityInputForm />
              </CardHeader>
              <CardBody className="text-center">
                <Card>
                  <CardBody>
                    <Card className="text-white" color="info">
                      <small className="text-left ml-1">
                        Last update: 12:06 PM
                      </small>
                      <CardBody>
                        <CardTitle tag="h3">الرياض</CardTitle>
                        <CardSubtitle>
                          <em>مشمس</em>
                          <img
                            src="http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png"
                            alt=""
                            className="weather-icon mx-2"
                          />
                        </CardSubtitle>
                        <div className="mt-2">
                          <div>
                            <span>درجة الحرارة: &#8451;25 </span>
                          </div>
                          <div className="info-grid">
                            <span>درجة الحرارة العظمى: &#8451;28</span>
                            <span>درجة الحرارة الدنيا: &#8451;21</span>
                            <span>سرعة الرياح: 13 كم/س</span>
                            <span>اتجاه الرياح: 170 درجة</span>
                            <span>شروق الشمس: 06:26 ص</span>
                            <span>غروب الشمس: 5:49 م</span>
                          </div>
                          {/* <span>درجة الحرارة (فهرنهايت): 77</span>
                          <br />
                          <span>درجة الحرارة العظمى (فهرنهايت): 83</span> */}
                        </div>
                      </CardBody>
                    </Card>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <Row>
          <Col md="8">مرحباً بك في تطبيق الطقس في الزمن الحقيقي</Col>
        </Row> */}
      </Container>
    );
  }
}

export default App;

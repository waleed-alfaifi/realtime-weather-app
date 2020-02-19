import React, { useState } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';

const CityInputForm = ({ updateCity, tempType, updateTempType }) => {
  const [city, setCity] = useState('');

  const handleCityChange = e => {
    const { value } = e.target;
    setCity(value);
  };

  const handleCitySubmit = e => {
    e.preventDefault();
    if (city !== '') {
      updateCity(city);
      setCity('');
    }
  };

  return (
    <Form onSubmit={handleCitySubmit}>
      <FormGroup className="text-right mt-3">
        <Input
          placeholder="أدخل مدينتك هنا"
          value={city}
          onChange={handleCityChange}
        />
        <Input
          type="select"
          className="degree-type-input"
          value={tempType}
          onChange={updateTempType}
        >
          <option value="C">مئوية</option>
          <option value="F">فهرنهايت</option>
        </Input>

        <Button type="submit" color="success" block>
          ابحث
        </Button>
      </FormGroup>
    </Form>
  );
};

export default CityInputForm;

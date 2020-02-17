import React from 'react';
import { Form, FormGroup, Label, Input, Button, InputGroup } from 'reactstrap';

const CityInputForm = () => {
  return (
    <Form>
      <FormGroup className="text-right mt-3">
        <Input id="cityInput" placeholder="أدخل مدينتك هنا" />
        <Input type="select" className="degree-type-input">
          <option value="C">مئوية</option>
          <option value="F">فهرنهايت</option>
        </Input>

        <Button type="button" color="success" block>
          ابحث
        </Button>
      </FormGroup>
    </Form>
  );
};

export default CityInputForm;

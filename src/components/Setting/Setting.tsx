import React from 'react';
import { Col, Row } from 'react-bootstrap';
import SettingConfig from '../SettingConfig/SettingConfig';

import './setting.css';

function Setting() {
  return (
    <Row>
      <Col lg={4}>
        <SettingConfig />
        <div className="flex-fill">
          <p>Action</p>
        </div>
      </Col>
      <Col lg={8}>
        <h1>Flow</h1>
      </Col>
    </Row>
  );
}

export default Setting;

import React, { useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import SettingConfig from '../SettingConfig/SettingConfig';
import Actions from '../Actions/Actions';
import Flow from '../Flow/Flow';

import './Setting.css';

function Setting() {
  const flowEl = useRef();

  return (
    <div>
      <Row>
        <Col lg={4} className="sub-column">
          <div className="flex-fill d-flex flex-column">
            <SettingConfig />
          </div>
          <div className="flex-fill">
            <Actions />
          </div>
        </Col>
        <Col lg={8} className="sub-column d-flex flex-column">
          <div className="flex-fill ">
            <Flow ref={flowEl} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Setting;

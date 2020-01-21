import React, { useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import SettingConfig from '../SettingConfig/SettingConfig';
import Actions from '../Actions/Actions';
import Flow from '../Flow/Flow';

import './Setting.css';

function Setting(props: { spi: any }) {
  const { spi } = props;
  const flowEl = useRef();

  return (
    <div>
      <Row>
        <Col lg={4} className="sub-column">
          <div className="flex-fill d-flex flex-column">
            <SettingConfig />
          </div>
          <div className="flex-fill">
            <Actions spi={spi} />
          </div>
        </Col>
        <Col lg={5} className="sub-column d-flex flex-column">
          <div className="flex-fill ">
            <Flow ref={flowEl} />
          </div>
        </Col>
        <Col lg={3} className="sub-column d-flex flex-column">
          <div className="flex-fill ">
            <h2 className="sub-header">receipt</h2>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Setting;

import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Setting from '../Setting/Setting';
import Flow from '../Flow/Flow';
import Receipt from '../Receipt/Receipt';
import Status from '../Status/Status';
import Actions from '../Actions/Actions';
import './Pairing.css';

function Pairing() {
  // return (
  //   <div id="pairing" className="d-flex align-content-around flex-wrap">
  //     <div className="flex-fill1">
  //       <Setting />
  //     </div>
  //     <div className="flex-fill1">
  //       <Status />
  //     </div>
  //     <div className="flex-grow-111">
  //       <Flow />
  //     </div>
  //     <div className="flex-grow-111">
  //       <Actions />
  //     </div>
  //     <div className="flex-fill11">
  //       <Receipt />
  //     </div>
  //   </div>
  // );

  return (
    <div id="pairing">
      <Row>
        <Col lg={3} className="column">
          <div className="flex-fill d-flex flex-column">
            <Setting />
          </div>
          <div className="flex-fill">
            <Status />
          </div>
        </Col>
        <Col lg={6} className="column d-flex flex-column">
          <div className="flex-fill ">
            <Flow />
          </div>
          <div className="flex-fill ">
            <Actions />
          </div>
        </Col>
        <Col lg={3} className="column">
          <Receipt />
        </Col>
      </Row>
    </div>
  );
}
export default Pairing;

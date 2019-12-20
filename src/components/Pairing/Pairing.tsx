import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Setting from '../Setting/Setting';
import Flow from '../Flow/Flow';
import Receipt from '../Receipt/Receipt';
import Status from '../Status/Status';
import Actions from '../Actions/Actions';
import './Pairing.css';
import { pairing as pairingService } from '../../services';

type Props = {
  isAwaitingConfirmation: boolean;
  isFinishedPairing: boolean;
  spi: any;
};

function Pairing({ isAwaitingConfirmation, isFinishedPairing, spi }: Props) {
  const [isPaired, setIsPaired] = useState(false);

  function onPairingStatusChange(status: boolean) {
    setIsPaired(status);
    if (status) {
      pairingService.pair(spi);
    } else {
      pairingService.unpair(spi);
    }
    console.log(isPaired);
  }

  return (
    <div id="pairing">
      <Row>
        <Col lg={3} className="column">
          <div className="flex-fill d-flex flex-column">
            <Setting spi={spi} />
          </div>
          <div className="flex-fill">
            <Status
              isPaired={isPaired}
              onChangeStatus={onPairingStatusChange}
              isAwaitingConfirmation={isAwaitingConfirmation}
              isFinishedPairing={isFinishedPairing}
              spi={spi}
            />
          </div>
        </Col>
        <Col lg={6} className="column d-flex flex-column">
          <div className="flex-fill ">
            <Flow />
          </div>
          <div className="flex-fill ">
            <Actions isPaired={isPaired} />
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

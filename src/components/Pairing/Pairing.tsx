import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import PairingConfig from '../PairingConfig/PairingConfig';
import Flow from '../Flow/Flow';
import Status from '../Status/Status';
// import Actions from '../Actions/Actions';
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
    <div>
      <Row>
        <Col lg={4} className="sub-column">
          <div className="flex-fill d-flex flex-column">
            <PairingConfig spi={spi} />
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
        <Col lg={8} className="sub-column d-flex flex-column">
          <div className="flex-fill ">
            <Flow />
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default Pairing;
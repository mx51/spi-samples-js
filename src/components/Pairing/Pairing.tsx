import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Logger } from '@assemblypayments/spi-client-js';
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

function Pairing({ spi, isAwaitingConfirmation, isFinishedPairing }: Props) {
  const [isPaired, setIsPaired] = useState(localStorage.getItem('isPaired') === 'true');
  const flowEl = useRef(null);

  console.log('@@@', flowEl);

  useEffect(() => {
    localStorage.setItem('isPaired', isPaired.toString());
  }, [isPaired]);

  // const [pairingState, setPairingState] = useState({
  //   AwaitingCheckFromPos: false,
  //   Finished: false,
  // });
  const handlePairingStatusChange = useCallback((event: any) => {
    //   const { AwaitingCheckFromPos, Finished } = event.detail;
    //   setPairingState({
    //     AwaitingCheckFromPos,
    //     Finished,
    //   });
    const flowMsg = new Logger(flowEl.current);
    pairingService.printPairingStatus(flowMsg, spi);
    console.log('.......eventdetail', event.detail);
  }, []);
  useEffect(() => {
    document.addEventListener('PairingFlowStateChanged', handlePairingStatusChange);

    return function cleanup() {
      document.removeEventListener('PairingFlowStateChanged', handlePairingStatusChange);
    };
  });

  // eslint-disable-next-line no-shadow
  function onPairingStatusChange(isPaired: Boolean) {
    setIsPaired(isPaired === true);
    if (isPaired) {
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
            <PairingConfig spi={spi} isPaired={isPaired} />
          </div>
        </Col>
        <Col lg={8} className="sub-column d-flex flex-column">
          <div className="flex-fill text-break">
            <Flow ref={flowEl} />
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
      </Row>
    </div>
  );
}
export default Pairing;

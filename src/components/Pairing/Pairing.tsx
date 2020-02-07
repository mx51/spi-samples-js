import React, { useRef, useCallback, useEffect } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { Logger } from '@assemblypayments/spi-client-js';
import PairingConfig from '../PairingConfig/PairingConfig';
import Flow from '../Flow/Flow';
import Status from '../Status/Status';
// import Actions from '../Actions/Actions';
import './Pairing.css';
import { pairing as pairingService } from '../../services';

type Props = {
  confirmationCode: string;
  isAwaitingConfirmation: boolean;
  isFinishedPairing: boolean;
  spi: any;
  status: string;
};

function Pairing({ confirmationCode, spi, isAwaitingConfirmation, isFinishedPairing, status }: Props) {
  const flowEl = useRef(null);
  // const [isModalShown, setIsModalShown] = useState(false);

  console.log('@@@', flowEl);

  const handlePairingStatusChange = useCallback((event: any) => {
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
  return (
    <div>
      <Row>
        <Col lg={4} className="sub-column">
          <div className="flex-fill d-flex flex-column">
            <PairingConfig spi={spi} status={status} />
          </div>
          <div className="flex-fill">
            <Status
              status={status}
              isAwaitingConfirmation={isAwaitingConfirmation}
              isFinishedPairing={isFinishedPairing}
              spi={spi}
            />
          </div>
        </Col>
        <Col lg={8} className="sub-column d-flex flex-column">
          <div className="flex-fill text-break">
            <Flow ref={flowEl} />
            <Modal show={isAwaitingConfirmation} onHide={() => pairingService.pairingCancel(spi)}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmation Code</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>{confirmationCode}</h4>
                <Button
                  variant="primary"
                  className="btn-custom"
                  onClick={() => {
                    pairingService.pairingConfirmCode(spi);
                    // setModel('');
                  }}
                  block
                >
                  OK
                </Button>
              </Modal.Body>
            </Modal>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default Pairing;

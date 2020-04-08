import React, { useRef, useCallback, useEffect } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { Logger } from '@mx51/spi-client-js';
import PairingConfig from '../PairingConfig/PairingConfig';
import Flow from '../Flow/Flow';
import Status from '../Status/Status';
import { pairing as pairingService } from '../../services';

type Props = {
  confirmationCode: string;
  isAwaitingConfirmation: boolean;
  isFinishedPairing: boolean;
  message: String;
  spi: any;
  status: string;
  setPairingState: Function;
};

function Pairing({
  confirmationCode,
  spi,
  isAwaitingConfirmation,
  isFinishedPairing,
  status,
  message,
  setPairingState,
}: Props) {
  const flowEl = useRef(null);

  const handlePairingStatusChange = useCallback((event: any) => {
    const flowMsg = new Logger(flowEl.current);
    const { AwaitingCheckFromPos, ConfirmationCode, Finished, Message } = event.detail;
    setTimeout(() => {
      if (flowMsg.element) pairingService.printPairingStatus(flowMsg, spi);
    }, 1);
    setPairingState({
      AwaitingCheckFromPos,
      ConfirmationCode,
      Finished,
      Message,
    });
  }, []);
  useEffect(() => {
    document.addEventListener('PairingFlowStateChanged', handlePairingStatusChange);
    return function cleanup() {
      document.removeEventListener('PairingFlowStateChanged', handlePairingStatusChange);
    };
  }, []);

  return (
    <div>
      <Row>
        <Col lg={4} className="sub-column">
          <div className="flex-fill d-flex flex-column">
            <PairingConfig spi={spi} status={status} />
          </div>
          <div className="flex-fill">
            <Status status={status} isFinishedPairing={isFinishedPairing} spi={spi} Message={message} />
          </div>
        </Col>
        <Col lg={8} className="sub-column d-flex flex-column">
          <div className="flex-fill text-break">
            <Flow ref={flowEl} />
            <Modal show={isAwaitingConfirmation} onHide={() => pairingService.pairingCancel(spi)}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Pairing Code</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Please confirm the following code is shown on the EFTPOS terminal:</p>
                <h4 className="text-center">{confirmationCode}</h4>
                <div>
                  <Button
                    variant="primary"
                    className="btn-custom"
                    onClick={() => {
                      pairingService.pairingConfirmCode(spi);
                    }}
                    block
                  >
                    OK
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-custom"
                    onClick={() => {
                      pairingService.pairingCancel(spi);
                    }}
                    block
                  >
                    Cancel
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default Pairing;

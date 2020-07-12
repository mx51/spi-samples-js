import React, { useRef, useCallback, useEffect } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { Logger } from '@mx51/spi-client-js';
import PairingConfig from '../PairingConfig';
import Flow from '../Flow';
import Status from '../Status';
import { pairing as pairingService } from '../../services';

type Props = {
  confirmationCode: string;
  isAwaitingConfirmation: boolean;
  isFinishedPairing: boolean;
  message: String;
  spi: Spi;
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
  const flowEl = useRef<HTMLDivElement>(null);

  const handlePairingStatusChange = useCallback((event: PairingFlowState) => {
    const flowMsg = new Logger(flowEl.current);
    const { AwaitingCheckFromPos, ConfirmationCode, Finished, Message } = event.detail;
    setTimeout(() => {
      if (flowMsg.element) {
        if (event.detail.Message !== 'Pairing Successful!') {
          pairingService.handlePairingUpdate(flowMsg, spi.CurrentPairingFlowState);
        } else {
          pairingService.printPairingStatus(flowMsg, spi);
        }
      }
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
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default Pairing;

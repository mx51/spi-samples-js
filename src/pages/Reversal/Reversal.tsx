import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Logger } from '@mx51/spi-client-js';
import { Col, Row } from 'react-bootstrap';
import PosUtils from '../../services/_common/pos';
import { reversal as reversalService, transactionFlow as transactionFlowService } from '../../services';
import './Reversal.scss';
import { Input } from '../../components/Input';

type Props = {
  spi: Spi;
};

function Reversal({ spi }: Props) {
  const [posRefId, setPosRefId] = useState('');

  const flowEl = useRef<HTMLDivElement>(null);

  function handleReversalTransaction(m: Message, flowLogger: Logger) {
    if (m.detail.Finished) {
      PosUtils.processCompletedEvent(flowLogger, () => {}, reversalService, m.detail);
      spi.AckFlowEndedAndBackToIdle();
    } else {
      transactionFlowService.handleTransaction(flowLogger, m.detail);
    }
  }
  const handleReversal = useCallback((event) => {
    const flowMsg = new Logger(flowEl.current);
    handleReversalTransaction(event, flowMsg);
  }, []);

  useEffect(() => {
    document.addEventListener('TxFlowStateChanged', handleReversal);
    return function cleanup() {
      document.removeEventListener('TxFlowStateChanged', handleReversal);
    };
  }, [handleReversal]);

  return (
    <div>
      <Row>
        <Col lg={6} className="sub-column">
          <h2 className="sub-header">Reversals</h2>
          <div className="alignment">
            <Input
              id="inpPostId"
              name="pos_ref_id"
              label="pos_ref_id"
              placeholder="pos_ref_id"
              required
              defaultValue={posRefId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPosRefId(e.target.value);
              }}
            />
            <button
              type="button"
              className="btn btn-primary rounded-0 btn-block btn-lg mb-2"
              onClick={() => reversalService.initiateReversal(new Logger(flowEl.current), spi, posRefId)}
            >
              Reversal
            </button>
          </div>
        </Col>
        <Col lg={6} className="sub-column d-flex flex-column">
          <div className="flex-fill text-break">
            <h2 className="sub-header mb-0">Flow</h2>
            <div className="flow-alignment" ref={flowEl} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Reversal;

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Logger, ReversalResponse } from '@mx51/spi-client-js';

import { Col, Row } from 'react-bootstrap';
import './Reversal.scss';
import { Input } from '../../components/Input';
import Flow from '../../components/Flow';

type Props = {
  spi: Spi;
};

function Reversal({ spi }: Props) {
  const [posRefId, setPosRefId] = useState('');

  const flowEl = useRef<HTMLDivElement>(null);

  function handleReversalTransaction(m: Message, flowLogger: Logger) {
    if (m.detail.Response != null) {
      if (m.detail.Response.Data.success) {
        flowLogger.Info(`# PosRefId: ${m.detail.Response.Data.pos_ref_id}`);
        flowLogger.Info(`# Success: ${m.detail.Response.Data.success}`);
      } else {
        flowLogger.Info(`# PosRefId: ${m.detail.Response.Data.pos_ref_id}`);
        flowLogger.Info(`# Success: ${m.detail.Response.Data.success}`);
        flowLogger.Info(`# Error Detail: ${m.detail.Response.Data.error_detail}`);
        flowLogger.Info(`# Error Reason: ${m.detail.Response.Data.error_reason}`);
      }
      spi.AckFlowEndedAndBackToIdle();
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
            <button type="button" className="primary-button" onClick={() => spi.InitiateReversal(posRefId)}>
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

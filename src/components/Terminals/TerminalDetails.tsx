import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { Logger } from '@mx51/spi-client-js';
import { connect } from 'react-redux';

import Unpair from './Unpair';
import Inprogress from './Inprogress';
import { updateActiveTerminal } from '../../features/terminals/terminalSlice';

import PairingConfig from '../PairingConfig';
import Flow from '../Flow';
import Status from '../Status';
import { pairing as pairingService } from '../../services';

const mapDispatchToProps = {
  handleaBackToTerminals: () => updateActiveTerminal({}),
};

function TerminalDetails(props: any) {
  const { handleaBackToTerminals, terminal } = props;
  console.log('TerminalDetails', terminal);

  return (
    <div>
      <br />
      <Button variant="link" block onClick={handleaBackToTerminals} className="text-left pt-0">
        &#60; Back to Terminals
      </Button>

      <Row>
        <Col lg={4} className="sub-column">
          <div className="flex-fill d-flex flex-column">
            <Unpair terminal={terminal} />
          </div>
          <div className="flex-fill">
            <Inprogress terminal={terminal} />
          </div>
        </Col>
        <Col lg={8} className="sub-column d-flex flex-column">
          <div className="flex-fill text-break">
            <Flow />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(TerminalDetails);

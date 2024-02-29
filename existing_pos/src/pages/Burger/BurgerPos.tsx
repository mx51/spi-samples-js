import React, { useState, useEffect, useCallback } from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { ReactComponent as Logo } from '../../images/mx51.svg';
import Products from '../../components/Products';
import Pairing from '../../components/Pairing';
import Setting from '../../components/Setting';
import SpiService from './spiService';
import './BurgerPos.scss';
import Reversal from '../Reversal';

function handlePaymentInProgressCallback(event: any, setInProgressPayment: Function) {
  if (event.detail.Finished !== true) {
    window.localStorage.setItem('payment_progress', true.toString());
    setInProgressPayment(true);
  } else {
    window.localStorage.setItem('payment_progress', false.toString());
    setInProgressPayment(false);
  }
}

const spiService = new SpiService();

function BurgerPos() {
  if (!spiService._spi) spiService.start();

  const [errorMsg, setErrorMsg] = useState('');
  const [showUnknownModal, setShowUnknownModal] = useState(false);
  const [inProgressPayment, setInProgressPayment] = useState(
    window.localStorage.getItem('payment_progress') === 'true'
  );
  const [suppressMerchantPassword, setSuppressMerchantPassword] = useState(
    window.localStorage.getItem('suppress_merchant_password_input') === 'true'
  );
  const [openPricing, setOpenPricing] = useState(window.localStorage.getItem('open_pricing') === 'true');

  const [pairingState, setPairingState] = useState({
    AwaitingCheckFromPos: false,
    ConfirmationCode: '',
    Finished: true,
    Message: '',
  });
  const [statusState, setStatusState] = useState(spiService._spi.CurrentStatus);

  useEffect(() => {
    if (spiService.start && inProgressPayment === true) {
      setShowUnknownModal(true);
    } else {
      window.localStorage.setItem('payment_progress', false.toString());
      setInProgressPayment(false);
    }

    return () => window.location.reload();
  }, []);

  const handleStatusChange = useCallback((event: any) => {
    setStatusState(event.detail);
  }, []);
  useEffect(() => {
    document.addEventListener('StatusChanged', handleStatusChange);
    return function cleanup() {
      document.removeEventListener('StatusChanged', handleStatusChange);
    };
  });

  const handlePaymentInProgress = useCallback((event: any) => {
    handlePaymentInProgressCallback(event, setInProgressPayment);
  }, []);
  useEffect(() => {
    document.addEventListener('TxFlowStateChanged', handlePaymentInProgress);

    return function cleanup() {
      document.removeEventListener('TxFlowStateChanged', handlePaymentInProgress);
    };
  });

  return (
    <div>
      <Tab.Container id="pos-tabs" defaultActiveKey="sample" unmountOnExit>
        <Row className="window-fix">
          <Col sm={2} className="menu-sidebar min-vh-100">
            <div className="sticky-top">
              <h1 className="logo">
                <Logo width="100" height="50" title="mx51 Logo" />
              </h1>
              <Nav variant="pills" className="flex-column sidebar-links">
                <Nav.Item>
                  <Nav.Link eventKey="sample">Sample POS</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="pairing">Pairing</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="setting">Setting</Nav.Link>
                </Nav.Item>
                {window.location.search.includes('qamode=true') && (
                  <Nav.Item>
                    <Nav.Link eventKey="reversals">Reversals</Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </div>
          </Col>
          <Col sm={10}>
            <Tab.Content>
              <Tab.Pane eventKey="sample">
                <Products
                  spi={spiService._spi}
                  status={statusState}
                  showUnknownModal={showUnknownModal}
                  setShowUnknownModal={setShowUnknownModal}
                  suppressMerchantPassword={suppressMerchantPassword}
                  errorMsg={errorMsg}
                  onErrorMsg={setErrorMsg}
                  openPricing={openPricing}
                  setOpenPricing={setOpenPricing}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="pairing">
                <Pairing
                  confirmationCode={pairingState.ConfirmationCode}
                  isAwaitingConfirmation={pairingState.AwaitingCheckFromPos}
                  isFinishedPairing={pairingState.Finished}
                  status={statusState}
                  spi={spiService._spi}
                  message={pairingState.Message}
                  setPairingState={setPairingState}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="setting">
                <Setting
                  spi={spiService._spi}
                  status={statusState}
                  errorMsg={errorMsg}
                  onErrorMsg={setErrorMsg}
                  suppressMerchantPassword={suppressMerchantPassword}
                  setSuppressMerchantPassword={setSuppressMerchantPassword}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="reversals">
                <Reversal spi={spiService._spi} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default BurgerPos;

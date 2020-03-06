import React, { useState, useEffect, useCallback } from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { SpiStatus } from '@mx51/spi-client-js';
// import { getSpiVersion } from '../../services/_common/uiHelpers';
import Products from '../../components/Products/products';
import Pairing from '../../components/Pairing/Pairing';
import Setting from '../../components/Setting/Setting';
import SpiService from './spiService';
import './BurgerPos.scss';

const spiService = new SpiService();
console.log(spiService.start);
spiService.start();

function BurgerPos() {
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
  const [statusState, setStatusState] = useState(SpiStatus.Unpaired);

  useEffect(() => {
    if (spiService.start && inProgressPayment === true) {
      setShowUnknownModal(true);
    } else {
      window.localStorage.setItem('payment_progress', false.toString());
      setInProgressPayment(false);
    }
  }, []);
  const handleStatusChange = useCallback((event: any) => {
    console.log('---------', event.detail);
    setStatusState(event.detail);
  }, []);
  useEffect(() => {
    document.addEventListener('StatusChanged', handleStatusChange);
    return function cleanup() {
      document.addEventListener('StatusChanged', handleStatusChange);
    };
  });
  const handlePairingStatusChange = useCallback((event: any) => {
    const { AwaitingCheckFromPos, ConfirmationCode, Finished, Message } = event.detail;
    setPairingState({
      AwaitingCheckFromPos,
      ConfirmationCode,
      Finished,
      Message,
    });
    console.log(event.detail);
  }, []);
  useEffect(() => {
    document.addEventListener('PairingFlowStateChanged', handlePairingStatusChange);

    return function cleanup() {
      document.removeEventListener('PairingFlowStateChanged', handlePairingStatusChange);
    };
  });

  const handlePaymentInProgress = useCallback((event: any) => {
    if (event.detail.Finished !== true) {
      window.localStorage.setItem('payment_progress', true.toString());
      setInProgressPayment(true);
    } else {
      window.localStorage.setItem('payment_progress', false.toString());
      setInProgressPayment(false);
    }
  }, []);
  useEffect(() => {
    document.addEventListener('TxFlowStateChanged', handlePaymentInProgress);

    return function cleanup() {
      document.addEventListener('TxFlowStateChanged', handlePaymentInProgress);
    };
  });

  // const [purchaseState, setPurchaseState] = useState({});
  // const handlePurchaseStatusChange = useCallback((event: any) => {
  //   setPurchaseState({ ...event.detail });
  //   console.log(event.detail);
  // }, []);
  // useEffect(() => {
  //   document.addEventListener('TxFlowStateChanged', handlePurchaseStatusChange);

  //   return function cleanup() {
  //     document.removeEventListener('TxFlowStateChanged', handlePurchaseStatusChange);
  //   };
  // });

  return (
    <div>
      {/* <h1 className="bpos-heading h3">Welcome to BurgerPOS (v{getSpiVersion()})</h1> */}
      <Tab.Container id="pos-tabs" defaultActiveKey="sample" unmountOnExit>
        <Row className="window-fix">
          <Col sm={2} className="menu-sidebar min-vh-100">
            <div className="sticky-top">
              <h1 className="logo">
                <img src="/images/mx51.svg" width="100" height="50" alt="Assembly Payments Logo" />
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
                  Message={pairingState.Message}
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
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default BurgerPos;

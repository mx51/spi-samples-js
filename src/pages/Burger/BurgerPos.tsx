import React from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
// import { getSpiVersion } from '../../services/_common/uiHelpers';
import Products from '../../components/Products/products';
import Pairing from '../../components/Pairing/Pairing';
import Setting from '../../components/Setting/Setting';
import './BurgerPos.css';
import SpiService from './spiService';

const spiService = new SpiService();
spiService.start();

function BurgerPos() {
  // const [pairingState, setPairingState] = useState({
  //   AwaitingCheckFromPos: false,
  //   Finished: false,
  // });
  // const handlePairingStatusChange = useCallback((event: any) => {
  //   const { AwaitingCheckFromPos, Finished } = event.detail;
  //   setPairingState({
  //     AwaitingCheckFromPos,
  //     Finished,
  //   });
  //   console.log(event.detail);
  // }, []);
  // useEffect(() => {
  //   document.addEventListener('PairingFlowStateChanged', handlePairingStatusChange);

  //   return function cleanup() {
  //     document.removeEventListener('PairingFlowStateChanged', handlePairingStatusChange);
  //   };
  // });

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
                <img src="./images/assembly-logo.png" width="48" height="32" alt="Assembly Payments Logo" />
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
                <Products spi={spiService._spi} />
              </Tab.Pane>
              <Tab.Pane eventKey="pairing">
                <Pairing
                  // isAwaitingConfirmation={pairingState.AwaitingCheckFromPos}
                  // isFinishedPairing={pairingState.Finished}
                  spi={spiService._spi}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="setting">
                <Setting spi={spiService._spi} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default BurgerPos;

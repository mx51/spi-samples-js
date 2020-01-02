import React from 'react';
// import { Form, Row, Col } from 'react-bootstrap';
// import './Actions.css';
// import Input from '../Input/Input';

function Actions() {
  return (
    <div>
      <h2 className="sub-header">Actions</h2>
      <button type="button">aaa</button>
      <button type="button">aaa</button>
    </div>
  );
}

// function Actions(props: { isPaired: Boolean }) {
//   const { isPaired } = props;

//   function actionWhenPaired() {
//     return (
//       <div className="whenpaired-button">
//         <button type="button" className="actions-button">
//           Purchase
//         </button>
//         <button type="button" className="actions-button">
//           Moto
//         </button>
//         <button type="button" className="actions-button">
//           Cashout
//         </button>
//         <button type="button" className="actions-button">
//           Refund
//         </button>
//         <button type="button" className="actions-button">
//           Settle
//         </button>
//         <button type="button" className="actions-button">
//           Settle enquiry
//         </button>
//         <button type="button" className="actions-button">
//           Last transation
//         </button>
//         <button type="button" className="actions-button">
//           Recover
//         </button>
//         <button type="button" className="actions-button">
//           Print
//         </button>
//         <button type="button" className="actions-button">
//           Save receipt
//         </button>
//         <button type="button" className="actions-button">
//           Terminal status
//         </button>
//         <button type="button" className="actions-button">
//           Settle
//         </button>
//         <div>
//           <Row>
//             <Col sm={6}>
//               <Input id="txtAmount" name="amount" label="Amount" />
//               <Input id="txtTipAmount" name="tipAmount" label="Tip amount" />
//               <Input id="txtCashAmount" name="cashoutAmout" label="Cashout amount" />
//               <Input id="txtSurchargeAmount" name="surchargeAmount" label="Surcharge amount" />
//             </Col>
//             <Col sm={6}>
//               <Form.Check
//                 className="receipt-header"
//                 type="checkbox"
//                 id="check-Print-merchant-copy"
//                 label="Print merchant copy"
//               />{' '}
//               <textarea placeholder="Receipt header" className="actions-text" />
//               <textarea placeholder="Receipt footer" className="actions-text" />
//               <Input id="txtPosRefId" name="posRefId" label="POS Ref ID" />
//             </Col>
//           </Row>
//         </div>
//       </div>
//     );
//   }

//   function actionWhenUnpaired() {
//     return (
//       <div>
//         <div className="actions">
//           <button type="button" className="actions-button">
//             Print
//           </button>
//           <button type="button" className="actions-button">
//             Save
//           </button>
//           <button type="button" className="actions-button">
//             Terminal status
//           </button>
//         </div>
//         <div className="actions-checkbox">
//           <Form.Check type="checkbox" id="check-Print-merchant-copy" label="Print merchant copy" />
//         </div>
//         <div className="actions-receipts">
//           <textarea placeholder="Receipt header" className="actions-textarea" />
//           <br />
//           <textarea placeholder="Receipt footer" className="actions-textarea" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <p className="actions-header">Actions </p>
//       {isPaired ? actionWhenPaired() : actionWhenUnpaired()}
//     </div>
//   );
// }

export default Actions;

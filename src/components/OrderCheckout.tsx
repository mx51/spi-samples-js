import React from 'react';
import { Col, Row } from 'react-bootstrap';

function OrderCheckout(props: { list: any; totalPaidAmount: number; totalBillAmount: number; onClose: Function }) {
  const { list, totalPaidAmount, totalBillAmount, onClose } = props;
  // const groupedProducts: any = [];
  console.log(list);

  // list.forEach((item: Product) => {
  //   if (!groupedProducts[item.id]) {
  //     groupedProducts[item.id] = { ...item, count: 1 };
  //   } else {
  //     groupedProducts[item.id] = { ...item, count: groupedProducts[item.id].count + 1 };
  //   }
  //   // setgroupedProducts(groupedProducts);
  // });

  console.log('Grouped: ', list);

  return (
    <div className="min-vh-100 sticky-top">
      <h1 className="logo">
        <img src="./images/assembly-logo.png" width="48" height="32" alt="Assembly Payments Logo" />
      </h1>
      <ul className="nobull">
        {list.map((item: any) => (
          <li className="space" key={item.id}>
            <Row>
              <Col sm={10}>
                <Row>
                  <button className="orderLists" type="button">
                    <Col sm={1}>{item.quantity} </Col>
                    <Col sm={1}> X </Col>
                    <Col sm={5}>{item.name}</Col>
                    <Col sm={3}>${item.price}.00</Col>
                    <Col sm={2}>${item.price * item.quantity}.00</Col>
                  </button>
                </Row>
              </Col>
            </Row>
          </li>
        ))}
      </ul>
      <div className="orderCheckout-total">
        <hr />
        Total(${totalPaidAmount} paid)
        <h3 className="order-amount-total">${totalBillAmount}</h3>
      </div>
      <div className="orderCheckout-change">
        Change
        <h3 className="order-amount-change">${totalPaidAmount - totalBillAmount}</h3>
      </div>
      <button type="button" className="checkout-button" onClick={() => onClose()}>
        Back
      </button>
    </div>
  );
}

export default OrderCheckout;

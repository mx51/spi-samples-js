import React, { useState } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { SpiStatus, TransactionType } from '@mx51/spi-client-js';
import Checkout from '../Checkout';
import Order from '../Order';
import './Products.scss';
import ProductList from '../ProductList';
import allProducts from './ProductData';
import { transactionFlow as transactionFlowService } from '../../services';

function productClick(
  shortlistedProducts: Array<Product>,
  productList: AllProducts,
  id: string,
  updateShortlistedProducts: Function
) {
  const products = [...shortlistedProducts];
  // find the clicked product id in existing shortlisted products list
  let shortlistedId = -1;
  shortlistedProducts.forEach((p: Product, index: number) => {
    if (p.id === id) {
      shortlistedId = index;
    }
  });

  // if clicked product found in shortlisted product list then increment the quantity
  if (shortlistedId > -1) {
    products[shortlistedId].quantity += 1;
  } else {
    // else find the clicked product details in allProducts array and insert it at top
    // of short listed product list.
    let clickedProduct: Product;
    productList.forEach((c: CategoryProducts) =>
      c.list.forEach((p: Product) => {
        if (p.id === id) {
          clickedProduct = p;
          products.unshift({ ...clickedProduct, quantity: 1 }); // push item on top of array using `unshift`
        }
      })
    );
  }

  updateShortlistedProducts(products);
}

function changeProductQuantity(
  shortlistedProducts: Array<Product>,
  updateShortlistedProducts: Function,
  id: string,
  quantity: number
) {
  const products = [...shortlistedProducts];

  // find the clicked product id in existing shortlisted products list
  let shortlistedId = -1;
  shortlistedProducts.forEach((p: Product, index: number) => {
    if (p.id === id) {
      shortlistedId = index;
    }
  });

  // if clicked product found in shortlisted product list then decrement the quantity
  if (shortlistedId > -1) {
    products[shortlistedId].quantity += quantity;
    // if the quantity reaches 0, then remove the product from shortlisted product
    if (products[shortlistedId].quantity === 0) {
      products.splice(shortlistedId, 1);
    }
  }

  updateShortlistedProducts(products);
}

function getTransaction(status: string, onErrorMsg: Function, setCheckout: Function, setTransactionAction: Function) {
  if (status !== SpiStatus.PairedConnected) {
    onErrorMsg('Please pair your POS to the terminal or check your network connection');
  } else {
    setCheckout(true);
    setTransactionAction(TransactionType.GetTransaction);
  }
}

function lastTransaction(status: string, onErrorMsg: Function, setCheckout: Function, setTransactionAction: Function) {
  if (status !== SpiStatus.PairedConnected) {
    onErrorMsg('Please pair your POS to the terminal or check your network connection');
  } else {
    setCheckout(true);
    setTransactionAction(TransactionType.GetLastTransaction);
  }
}

function checkoutAction(shortlistedProducts: Array<Product>, setTransactionAction: Function, setCheckout: Function) {
  if (shortlistedProducts.length === 0) {
    setTransactionAction('');
  } else {
    setTransactionAction(TransactionType.Purchase);
  }
  setCheckout(true);
}

function refundAction(setCheckout: Function, setTransactionAction: Function) {
  setCheckout(true);
  setTransactionAction(TransactionType.Refund);
}

function noThanksAction(
  setCheckout: Function,
  setTransactionAction: Function,
  spi: Spi,
  updateShortlistedProducts: Function,
  setTransactionStatus: Function
) {
  transactionFlowService.acknowledgeCompletion({ Info: () => {}, Clear: () => {} }, spi, () => {});
  setCheckout(false);
  setTransactionAction('');
  updateShortlistedProducts([]);
  setTransactionStatus(false);
}

function checkoutClosed(setCheckout: Function, setTransactionAction: Function) {
  setCheckout(false);
  setTransactionAction('');
}

function overrideTransaction(spi: Spi, setShowUnknownModal: Function) {
  spi.AckFlowEndedAndBackToIdle();
  setShowUnknownModal(false);
}

type Props = {
  spi: Spi;
  status: string;
  showUnknownModal: boolean;
  setShowUnknownModal: Function;
  suppressMerchantPassword: boolean;
  errorMsg: string;
  onErrorMsg: Function;
  openPricing: boolean;
  setOpenPricing: Function;
};

function Products({
  spi,
  status,
  showUnknownModal,
  setShowUnknownModal,
  suppressMerchantPassword,
  errorMsg,
  onErrorMsg,
  openPricing,
  setOpenPricing,
}: Props) {
  const [shortlistedProducts, updateShortlistedProducts] = useState<Array<Product>>([]);
  const [checkout, setCheckout] = useState(false);
  const [posRefId, setPosRefId] = useState('');
  const [transactionAction, setTransactionAction] = useState('');
  const [surchargeAmount, setSurchargeAmount] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState<boolean>(false);

  return (
    <>
      <Row>
        <Modal show={showUnknownModal} onHide={() => setShowUnknownModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Alert</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Let the POS know that customer actually paid?</p>
            <Button
              variant="primary"
              className="btn-custom unknownStatusButton"
              onClick={() => overrideTransaction(spi, setShowUnknownModal)}
            >
              Paid
            </Button>
            <Button
              variant="primary"
              className="btn-custom"
              onClick={() => overrideTransaction(spi, setShowUnknownModal)}
            >
              Fail
            </Button>
          </Modal.Body>
        </Modal>
        <Col lg={8}>
          {status !== SpiStatus.PairedConnected && (
            <div className="pairing_banner">Please check your device Pairing setting!!</div>
          )}

          {allProducts.map((cat) => (
            <ProductList
              key={cat.categoryName}
              category={cat}
              onProductClick={(id: string) =>
                productClick(shortlistedProducts, allProducts, id, updateShortlistedProducts)
              }
            />
          ))}
        </Col>
        <Col lg={4} className="order-sidebar">
          <Order
            list={shortlistedProducts}
            onChangeProductQuantity={(id: string, quantity: number) =>
              changeProductQuantity(shortlistedProducts, updateShortlistedProducts, id, quantity)
            }
            onGetTransaction={() => getTransaction(status, onErrorMsg, setCheckout, setTransactionAction)}
            onRefund={() => refundAction(setCheckout, setTransactionAction)}
            onLastTransaction={() => lastTransaction(status, onErrorMsg, setCheckout, setTransactionAction)}
            onCheckout={() => checkoutAction(shortlistedProducts, setTransactionAction, setCheckout)}
            handleApplySurcharge={setSurchargeAmount}
            posRefId={posRefId}
            setPosRefId={setPosRefId}
            surchargeAmount={surchargeAmount}
            status={status}
            errorMsg={errorMsg}
            onErrorMsg={onErrorMsg}
          />
          {checkout && (
            <Checkout
              visible={checkout}
              list={shortlistedProducts}
              onClose={() => checkoutClosed(setCheckout, setTransactionAction)}
              onNoThanks={() =>
                noThanksAction(setCheckout, setTransactionAction, spi, updateShortlistedProducts, setTransactionStatus)
              }
              posRefId={posRefId}
              spi={spi}
              surchargeAmount={surchargeAmount}
              setSurchargeAmount={setSurchargeAmount}
              setTransactionStatus={setTransactionStatus}
              transactionStatus={transactionStatus}
              transactionAction={transactionAction}
              showUnknownModal={showUnknownModal}
              setShowUnknownModal={setShowUnknownModal}
              handleOverrideTransaction={() => overrideTransaction(spi, setShowUnknownModal)}
              suppressMerchantPassword={suppressMerchantPassword}
              openPricing={openPricing}
              setOpenPricing={setOpenPricing}
              onErrorMsg={onErrorMsg}
              status={status}
            />
          )}
        </Col>
      </Row>
    </>
  );
}

export default Products;

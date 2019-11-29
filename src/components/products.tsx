import React, { useState } from 'react';
import './products.css';
import { Col, Row } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import trashAlt from '@iconify/icons-fa-regular/trash-alt';

type Products = Array<Category>;
type Category = {
  categoryName: string;
  list: Array<Product>;
};
type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
};

const handleProductClick = (
  id: string,
  allProducts: Products,
  shortlistedProducts: any,
  updateShortlistedProducts: any
) => {
  console.log(`clicked ... ${id}`);
  let clickedProduct;
  allProducts.forEach(c =>
    c.list.forEach(p => {
      if (p.id === id) {
        clickedProduct = p;
      }
    })
  );
  console.log(clickedProduct);
  const newList: any = [clickedProduct, ...shortlistedProducts];
  updateShortlistedProducts(newList);
  console.log(newList);
};

function Products() {
  const allProducts = [
    {
      categoryName: 'Burger',
      list: [
        {
          id: '101',
          name: 'Chicken burger',
          image: './images/chicken.jpg',
          price: '12',
        },
        {
          id: '102',
          name: 'Beef burger',
          image: './images/beef.png',
          price: '12',
        },
        {
          id: '103',
          name: 'Veggie burger',
          image: './images/veggie.jpg',
          price: '12',
        },
      ],
    },
    {
      categoryName: 'Sides',
      list: [
        {
          id: '201',
          name: 'Veggie Salad',
          image: './images/caesar.jpg',
          price: '7',
        },
        {
          id: '202',
          name: 'Caeser Salad',
          image: './images/caesar.jpg',
          price: '7',
        },
      ],
    },
    {
      categoryName: 'Drinks',
      list: [
        {
          id: '301',
          name: 'Coke',
          image: './images/pepsi.jpg',
          price: '4',
        },
      ],
    },
  ];

  const [shortlistedProducts, updateShortlistedProducts] = useState([]);
  const [checkout, setCheckout] = useState(false);

  function handleRemoveProduct(id: any) {
    console.log('Remove product', id);

    const newArr: any = [];

    let removed: Boolean = false;
    shortlistedProducts.forEach((item: Product) => {
      if (item.id === id && !removed) {
        removed = true;
      } else {
        newArr.push(item);
      }
    });

    updateShortlistedProducts(newArr);
  }

  function handleCheckout() {
    console.log('checkout clicked');
    setCheckout(true);
  }

  return (
    <>
      <Row>
        <Col lg={8}>
          {allProducts.map(cat => (
            <ProductCategory
              category={cat}
              onProductClick={handleProductClick}
              allProducts={allProducts}
              shortlistedProducts={shortlistedProducts}
              updateShortlistedProducts={updateShortlistedProducts}
            />
          ))}
        </Col>
        <Col lg={4} className="order-sidebar">
          <Order list={shortlistedProducts} onRemoveProduct={handleRemoveProduct} onCheckout={handleCheckout} />
          <Checkout visible={checkout} />
        </Col>
      </Row>
    </>
  );
}

function ProductCategory(props: {
  category: Category;
  onProductClick: Function;
  allProducts: any;
  shortlistedProducts: any;
  updateShortlistedProducts: any;
}) {
  const { category, onProductClick, allProducts, shortlistedProducts, updateShortlistedProducts } = props;
  return (
    <div>
      <h3 className="product-category">{category.categoryName}</h3>
      <hr />
      {category.list.map(p => (
        <>
          <button
            key={p.id}
            type="button"
            className="product-display"
            onClick={() => onProductClick(p.id, allProducts, shortlistedProducts, updateShortlistedProducts)}
          >
            <img src={p.image} alt={p.name} />
            <p> {p.name} </p>
          </button>
        </>
      ))}
    </div>
  );
}

function Order(props: { list: any; onRemoveProduct: Function; onCheckout: Function }) {
  const { list, onRemoveProduct, onCheckout } = props;
  const groupedProducts: any = [];

  list.forEach((item: Product) => {
    if (!groupedProducts[item.id]) {
      groupedProducts[item.id] = { ...item, count: 1 };
    } else {
      groupedProducts[item.id] = { ...item, count: groupedProducts[item.id].count + 1 };
    }
  });

  console.log('Grouped: ', groupedProducts);

  return (
    <div className="min-vh-100 sticky-top">
      <p className="order-header">Order</p>
      <ul className="nobull">
        {groupedProducts.map((item: any) => (
          <li className="space" key={item.id}>
            <Row>
              <Col sm={10}>
                <Row>
                  <button className="orderList" type="button" onClick={() => onRemoveProduct(item.id)}>
                    <Col sm={1}>{item.count} </Col>
                    <Col sm={1}> X </Col>
                    <Col sm={5}>{item.name}</Col>
                    <Col sm={3}>${item.price}.00</Col>
                    <Col sm={2}>${item.price * item.count}.00</Col>
                  </button>
                </Row>
              </Col>
              <Col sm={2}>
                <button className="bin-button" type="button">
                  <Icon icon={trashAlt} />
                </button>
              </Col>
            </Row>
          </li>
        ))}
      </ul>
      <h3 className="total">
        Total:
        <h3 className="order-amount">
          ${groupedProducts.reduce((total: any, product: any) => total + product.price * product.count, 0)}
        </h3>
      </h3>
      <button type="button" className="checkout-button" onClick={() => onCheckout()}>
        Checkout
      </button>
    </div>
  );
}

function Checkout(props: { visible: Boolean }) {
  const { visible } = props;
  return (
    <div className={`checkout-page ${visible ? '' : 'd-none'}`}>
      <Row>
        <Col sm={3}>
          <Order list={[]} onRemoveProduct={() => {}} onCheckout={() => {}} />
        </Col>
        <Col sm={9}>
          <div className="payment-options">
            <h2>Total</h2>
            <p> checkout </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default Products;

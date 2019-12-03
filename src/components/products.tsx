import React, { useState } from 'react';
import './products.css';
import { Col, Row } from 'react-bootstrap';
// import { Icon } from '@iconify/react';
// import trashAlt from '@iconify/icons-fa-regular/trash-alt';

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
          name: 'Bacon burger',
          image: './images/bacon and cheese.png',
          price: '12',
        },
        {
          id: '103',
          name: 'Vegan burger',
          image: './images/vegan.jpg',
          price: '12',
        },
        {
          id: '104',
          name: 'Beef burger',
          image: './images/beef.png',
          price: '12',
        },
        {
          id: '105',
          name: 'Veggie burger',
          image: './images/veggie.jpg',
          price: '12',
        },
        {
          id: '106',
          name: 'Lamb burger',
          image: './images/lamb.jpg',
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
          image: './images/salad.jpg',
          price: '7',
        },
        {
          id: '203',
          name: 'Small Fries',
          image: './images/small fries.jpg',
          price: '7',
        },
        {
          id: '204',
          name: 'Large Fries',
          image: './images/largefries.jpg',
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
        {
          id: '302',
          name: 'Kombucha',
          image: './images/kombuch.jpg',
          price: '4',
        },
        {
          id: '303',
          name: 'Orange Juice',
          image: './images/orange juice.jpg',
          price: '4',
        },
      ],
    },
  ];

  const [shortlistedProducts, updateShortlistedProducts] = useState<any[]>([]);
  const [checkout, setCheckout] = useState(false);

  const handleProductClick = (id: string) => {
    console.log(`clicked ... ${id}`);
    const products = [...shortlistedProducts];

    // find the clicked product id in existing shortlisted products list
    let shortlistedId = -1;
    shortlistedProducts.forEach((p, index) => {
      if (p.id === id) {
        shortlistedId = index;
      }
    });
    console.log('shortlistedId', shortlistedId);

    // if clicked product found in shortlisted product list then increment the quantity
    if (shortlistedId > -1) {
      products[shortlistedId].quantity += 1;
    } else {
      // else find the clicked product details in allProducts array and insert it at top
      // of short listed product list.
      let clickedProduct: any;
      allProducts.forEach(c =>
        c.list.forEach(p => {
          if (p.id === id) {
            clickedProduct = p;
          }
        })
      );
      products.unshift({ ...clickedProduct, quantity: 1 }); // push item on top of array using `unshift`
    }

    updateShortlistedProducts(products);
  };

  function handleRemoveProduct(id: any) {
    console.log('Remove product', id);

    const products = [...shortlistedProducts];

    // find the clicked product id in existing shortlisted products list
    let shortlistedId = -1;
    shortlistedProducts.forEach((p, index) => {
      if (p.id === id) {
        shortlistedId = index;
      }
    });

    // if clicked product found in shortlisted product list then decrement the quantity
    if (shortlistedId > -1) {
      products[shortlistedId].quantity -= 1;
      // if the quantity reaches 0, then remove the product from shortlisted product
      if (products[shortlistedId].quantity === 0) {
        products.splice(shortlistedId, 1);
      }
    }

    updateShortlistedProducts(products);
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
              key={cat.categoryName}
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
          <Checkout
            visible={checkout}
            list={shortlistedProducts}
            onRemoveProduct={handleRemoveProduct}
            onCheckout={handleCheckout}
          />
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
        <span key={`${category.categoryName}-${p.id}`}>
          <button
            type="button"
            className="product-display"
            onClick={() => onProductClick(p.id, allProducts, shortlistedProducts, updateShortlistedProducts)}
          >
            <img src={p.image} alt={p.name} />
            <p> {p.name} </p>
          </button>
        </span>
      ))}
    </div>
  );
}

function Order(props: { list: any; onRemoveProduct: Function; onCheckout: Function }) {
  const { list, onRemoveProduct, onCheckout } = props;
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
      <p className="order-header">Order</p>
      <ul className="nobull">
        {list.map((item: any) => (
          <li className="space" key={item.id}>
            <Row>
              <Col sm={10}>
                <Row>
                  <button className="orderList" type="button" onClick={() => onRemoveProduct(item.id)}>
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
      <div className="total">
        Total
        <h3 className="order-amount">
          ${list.reduce((total: any, product: any) => total + product.price * product.quantity, 0)}
        </h3>
      </div>
      <button type="button" className="checkout-button" onClick={() => onCheckout()}>
        Checkout
      </button>
    </div>
  );
}

function Checkout(props: { visible: Boolean; list: any; onRemoveProduct: Function; onCheckout: Function }) {
  const { visible, list } = props;

  function toggle() {
    document.body.classList.toggle('flyout-toggle');
  }

  function enterAmount() {
    return <p>hi</p>;
  }

  return (
    <div className={`checkout-page ${visible ? '' : 'd-none'}`}>
      <Row>
        <Col sm={3}>
          <Order list={list} onRemoveProduct={() => {}} onCheckout={() => {}} />
        </Col>
        <Col sm={9}>
          <div className="flyout">
            <button type="button" className="flyout-toggle" onClick={() => toggle()}>
              click
            </button>
            <div className="payment-options">
              <h2>Total ${list.reduce((total: any, product: any) => total + product.price * product.quantity, 0)}</h2>
              <hr />
              <div className="fastcash-div">
                <p className="fastcash-heading">Fast cash options</p>
                <button type="button">$5</button>
                <button type="button">$10</button>
                <button type="button">$20</button>
                <button type="button">$30</button>
                <button type="button">$40</button>
                <button type="button">$50</button>

                <div>
                  <button className="fastcash-input" type="button">
                    More cash option
                  </button>
                </div>
                <div>
                  <p> Other payment options</p>
                  <button className="fastcash-card" type="button" onClick={() => enterAmount()}>
                    Credit Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Products;

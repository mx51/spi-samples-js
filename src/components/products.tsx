import React from 'react';
import './products.css';
import { Col, Row } from 'react-bootstrap';

type Products = Array<Category>;
type Category = {
  categoryName: string;
  list: Array<Product>;
};
type Product = {
  id: string;
  name: string;
  image: string;
};

const handleProductClick = (id: Number) => {
  console.log(`clicked ... ${id}`);
};

function Products() {
  const allProducts = [
    {
      categoryName: 'Burger',
      list: [
        {
          id: '101',
          name: 'Chicken burger',
          image: `./images/chicken.jpg`,
        },
        {
          id: '102',
          name: 'Beef burger',
          image: './images/beef.png',
        },
        {
          id: '103',
          name: 'Veggie burger',
          image: './images/veggie.jpg',
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
        },
        {
          id: '202',
          name: 'Caeser Salad',
          image: './images/caesar.jpg',
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
        },
      ],
    },
  ];

  return (
    <>
      <Row>
        <Col sm={8}>
          {allProducts.map(cat => (
            <ProductCategory category={cat} onProductClick={handleProductClick} />
          ))}
        </Col>
        <Col sm={4} className="order-sidebar">
          <h1 className="order-header">Order</h1>
        </Col>
      </Row>
    </>
  );
}

function ProductCategory(props: { category: Category; onProductClick: Function }) {
  const { category } = props;
  const { onProductClick } = props;
  return (
    <div>
      <h3 className="product-category">{category.categoryName}</h3>
      <hr />
      {category.list.map(p => (
        <>
          <button type="button" className="product-display" onClick={() => onProductClick(p.id)}>
            <img src={p.image} alt={p.name} height="120" width="130" />
            <p> {p.name} </p>
          </button>
        </>
      ))}
    </div>
  );
}

export default Products;

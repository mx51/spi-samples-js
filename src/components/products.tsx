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
          image: `./images/chicken.jpg`,
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
          <Order list={shortlistedProducts} onRemoveProduct={handleRemoveProduct} />
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

function Order(props: { list: any; onRemoveProduct: Function }) {
  const { list } = props;
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
    <div>
      <h2 className="order-header">Order</h2>
      <ul className="nobull">
        {groupedProducts.map((item: any) => (
          <li className="space" key={item.id}>
            <button className="orderList" type="button">
              <Row>
                <Col sm={1}>{item.count} </Col>
                <Col sm={1}> X </Col>
                <Col sm={5}>{item.name}</Col>
                <Col sm={2}>${item.price}.00</Col>
                <Col sm={2}>${item.price * item.count}.00</Col>
                <Col sm={1}>
                  <Icon icon={trashAlt} />
                </Col>
              </Row>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Products;

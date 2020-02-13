import React from 'react';
import { Category } from '../types';
import './ProductList.scss';

function ProductList(props: {
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

export default ProductList;

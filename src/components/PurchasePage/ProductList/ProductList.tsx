import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import products from '../../../definitions/constants/productList';
import { IProduct } from '../../../redux/reducers/ProductSlice/interfaces';
import { addKeypadAmount, addProduct } from '../../../redux/reducers/ProductSlice/productSlice';

import Product from './Product';

function ProductList(): React.ReactElement {
  const dispatch = useDispatch();
  const addProductAction = (product: IProduct) => {
    dispatch(
      addProduct({
        product,
      })
    );
  };

  useEffect(() => {
    dispatch(addKeypadAmount(0)); // when user select product, then ensure keypad amount is always be 0
  }, []);

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-around">
      {products.map((product) => (
        <Product
          key={product.name}
          product={product}
          onClick={() => {
            addProductAction(product);
          }}
        />
      ))}
    </Box>
  );
}
export default ProductList;

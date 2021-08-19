import React from 'react';
import { Box } from '@material-ui/core';
import products from '../../../definitions/constants/productList';
import Product from '../Product';

function ProductList(): React.ReactElement {
  return (
    <Box display="flex" flexDirection="coloum" flexWrap="wrap" justifyContent="space-around">
      {products.map((product) => (
        <Product key={product.name} product={product} />
      ))}
    </Box>
  );
}
export default ProductList;

import React from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import currencyFormat from '../../../../utils/common/intl/currencyFormatter';
import useStyles from './index.styles';
import { ProductProps } from './interfaces';

export default function Product({ product, onClick }: ProductProps): React.ReactElement {
  const classes = useStyles();
  const productPriceInDollars = product.price / 100;

  return (
    <Box onClick={onClick}>
      <Card className={classes.cardStyle}>
        <CardActionArea>
          <CardMedia className={classes.productText} title={product.name}>
            <Box className={classes.productImage} display="flex" justifyContent="center">
              <img src={product.image} alt={product.name} />
            </Box>
          </CardMedia>
          <CardContent>
            <Typography className={classes.productName} variant="h5" component="h2">
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {currencyFormat(productPriceInDollars)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

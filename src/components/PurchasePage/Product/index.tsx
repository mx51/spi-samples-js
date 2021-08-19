import React from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core';
import useStyles from './index.styles';
import { ProductProps } from './interfaces';

export default function Product({ product }: ProductProps): React.ReactElement {
  const classes = useStyles();
  return (
    <Box>
      <Card className={classes.cardStyle}>
        <CardActionArea>
          <CardMedia className={classes.productText} title={product.name}>
            <Box
              className={classes.productImage}
              bgcolor={product.backgroundColor}
              display="flex"
              justifyContent="center"
            >
              {product.image}
            </Box>
          </CardMedia>
          <CardContent>
            <Typography className={classes.productName} variant="h5" component="h2">
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {product.price}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

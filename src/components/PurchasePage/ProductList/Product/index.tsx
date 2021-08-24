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
            <Box className={classes.productImage} display="flex" justifyContent="center">
              <img src={product.image} alt={product.name} />
            </Box>
          </CardMedia>
          <CardContent>
            <Typography className={classes.productName} variant="h5" component="h2">
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(product.price)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

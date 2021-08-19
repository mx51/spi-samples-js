import React from 'react';
import { ReactComponent as Cappuccino } from '../../images/product/Cappuccino.svg';
import { ReactComponent as ChaiLatte } from '../../images/product/ChaiLatte.svg';
import { ReactComponent as FlatWhite } from '../../images/product/FlatWhite.svg';
import { ReactComponent as HoneyLatte } from '../../images/product/HoneyLatte.svg';
import { ReactComponent as Latte } from '../../images/product/Latte.svg';
import { ReactComponent as Mocha } from '../../images/product/Mocha.svg';
import { ReactComponent as ProductionTestItem } from '../../images/product/ProductionTestItem.svg';
import { ReactComponent as RoseTeaLatte } from '../../images/product/RoseTeaLatte.svg';

export default [
  {
    name: 'Mocha',
    price: '$4.20',
    image: <Mocha />,
    backgroundColor: '#F9F0EB',
  },
  {
    name: 'Honey Latte',
    price: '$4.80',
    image: <HoneyLatte />,
    backgroundColor: '#DED9BB',
  },
  {
    name: 'Flat White',
    price: '$3.80',
    image: <FlatWhite />,
    backgroundColor: '#7FB5BF',
  },
  {
    name: 'Chai Latte',
    price: '$4.50',
    image: <ChaiLatte />,
    backgroundColor: '#E4B3B2',
  },
  {
    name: 'Rose Tea Latte',
    price: '$4.50',
    image: <RoseTeaLatte />,
    backgroundColor: '#1F3832',
  },
  {
    name: 'Cappuccino',
    price: '$3.80',
    image: <Cappuccino />,
    backgroundColor: '#253833',
  },
  {
    name: 'Latte',
    price: '$3.80',
    image: <Latte />,
    backgroundColor: '#253833',
  },
  {
    name: 'Production Test Item',
    price: '$0.01',
    image: <ProductionTestItem />,
    backgroundColor: '#ffffff',
  },
];

import { IProduct } from '../../redux/reducers/ProductSlice/interfaces';

const products: Array<IProduct> = [
  {
    id: 1,
    name: 'Mocha',
    price: 420,
    image: 'images/product/mocha.png',
  },
  {
    id: 2,
    name: 'Honey Latte',
    price: 480,
    image: 'images/product/honeyLatte.png',
  },
  {
    id: 3,
    name: 'Flat White',
    price: 380,
    image: 'images/product/flatWhite.png',
  },
  {
    id: 4,
    name: 'Chai Latte',
    price: 450,
    image: 'images/product/chaiLatte.png',
  },
  {
    id: 5,
    name: 'Rose Tea Latte',
    price: 450,
    image: 'images/product/roseTeaLatte.png',
  },
  {
    id: 6,
    name: 'Cappuccino',
    price: 380,
    image: 'images/product/cap.png',
  },
  {
    id: 7,
    name: 'Latte',
    price: 380,
    image: 'images/product/latte.png',
  },
  {
    id: 8,
    name: 'Espresso',
    price: 350,
    image: 'images/product/testItem.png',
  },
];

export default products;

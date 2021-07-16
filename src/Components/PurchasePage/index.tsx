import React from 'react';
import Button from '@material-ui/core/Button';
// component
import Layout from '../Layout';
// redux
import { incrementByAmount } from '../../redux/reducers/counterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const Purchase: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  const handleClickCounter = () => {
    dispatch(incrementByAmount(5));
  };

  return (
    <Layout>
      <p>Purchase Page</p>
      <div>
        <Button onClick={handleClickCounter}>Counter is: {count}</Button>
      </div>
    </Layout>
  );
};

export default Purchase;

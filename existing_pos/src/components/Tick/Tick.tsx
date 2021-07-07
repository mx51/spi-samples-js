import React from 'react';
import { ReactComponent as IconTick } from '../../images/tick.svg';
import './tick.scss';

const Tick = (props: { className: any }) => {
  const { className } = props;
  return (
    <div>
      <IconTick className={className} />
    </div>
  );
};

export default Tick;

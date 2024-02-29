import React, { forwardRef } from 'react';

type Props = {};

function Flow(props: Props, ref: any) {
  return (
    <div>
      <h2 className="sub-header">Flow </h2>
      <div className="ml-3 mr-3" ref={ref} />
    </div>
  );
}

export default forwardRef(Flow);

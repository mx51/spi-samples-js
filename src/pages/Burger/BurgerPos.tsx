import React from 'react';
import { getSpiVersion } from '../../services/_common/uiHelpers';

function BurgerPos() {
  return (
    <div>
      <h1>Welcome to BurgerPOS (v{getSpiVersion()})</h1>
    </div>
  );
}

export default BurgerPos;

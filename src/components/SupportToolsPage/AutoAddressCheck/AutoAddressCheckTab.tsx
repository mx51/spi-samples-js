import React from 'react';
import { CustomTab } from '../../CustomTab/CustomTab';
import AutoAddressCheck from '.';

export const AutoAddressCheckTab: React.FC<{ tabIndex: number }> = ({ tabIndex }) => (
  <CustomTab
    index={0}
    title="Auto address check"
    subtitle="This support tool can be used by Merchants or L2 support users to test Auto address"
    value={tabIndex}
  >
    <AutoAddressCheck />
  </CustomTab>
);

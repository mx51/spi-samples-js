import React from 'react';
import { CustomTabPanel } from '../CustomTab/CustomTabPanel';
import AutoAddressCheck from '.';

export const AutoAddressCheckPage: React.FC<{ tabIndex: number }> = ({ tabIndex }) => (
  <CustomTabPanel
    index={0}
    title="Auto address check"
    subtitle="This support tool can be used by Merchants or L2 support users to test Auto address"
    value={tabIndex}
  >
    <AutoAddressCheck />
  </CustomTabPanel>
);

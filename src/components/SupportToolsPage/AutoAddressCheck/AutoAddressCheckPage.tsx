import React from 'react';
import { CustomTabPage } from '../../CustomTabPage/CustomTabPage';
import AutoAddressCheck from '.';

export const AutoAddressCheckPage: React.FC<{ tabIndex: number }> = ({ tabIndex }) => (
  <CustomTabPage
    index={0}
    title="Auto address check"
    subtitle="This support tool can be used by Merchants or L2 support users to test Auto address"
    value={tabIndex}
  >
    <AutoAddressCheck />
  </CustomTabPage>
);

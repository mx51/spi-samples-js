import React, { useState } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import Layout from '../Layout';
import useStyles from './index.styles';
import { GetTransactionPage } from './GetTransaction/GetTransactionPage';
import { AutoAddressCheckPage } from './AutoAddressCheck/AutoAddressCheckPage';

const SupportToolsPage: React.FC = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.ReactNode, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Layout>
      <div className={classes.root}>
        <Tabs
          aria-label="support tabs"
          className={classes.tabs}
          id="supportTabs"
          onChange={handleTabChange}
          value={tabIndex}
        >
          <Tab id="autoAddressTab" label="Auto Address Check" />
          <Tab id="getTransactionTab" label="Get Transaction" />
        </Tabs>

        <AutoAddressCheckPage tabIndex={tabIndex} />
        <GetTransactionPage tabIndex={tabIndex} />
      </div>
    </Layout>
  );
};

export default SupportToolsPage;

import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Layout from '../Layout';
import { usePayAtTableStyles } from './PayAtTablePage.style';
import { Table } from './Table/Table';
import { useAppSelector } from '../../redux/hooks';
import { getAllTables } from '../../redux/reducers/PayAtTableSlice/payAtTableSelector';
import {
  addCostToATable,
  addNewTable,
  closeTable,
  toggleLocked,
  updateOperatorId,
} from '../../redux/reducers/PayAtTableSlice/payAtTableSlice';
import spiService from '../../services/spiService';

const PayAtTable: React.FC = () => {
  const classes = usePayAtTableStyles();
  const tables = useAppSelector(getAllTables);
  const dispatch = useDispatch();

  return (
    <Layout>
      <Container className={classes.container} maxWidth="md">
        <Typography variant="h6" component="h1">
          Pay At Tables
        </Typography>
        <Grid container spacing={2}>
          {tables.map((table) => (
            <Grid key={table.tableId} item xs={4}>
              <Table
                onToggleLocked={() => {
                  dispatch(toggleLocked(table.tableId));
                }}
                onNewCostAdded={(cost) => {
                  dispatch(addCostToATable({ tableId: table.tableId, cost }));
                }}
                onClose={() => dispatch(closeTable(table.tableId))}
                locked={table.locked}
                title={table.label}
                totalAmount={table.totalAmount}
                dueAmount={table.outStandingAmount}
                operatorIds={
                  spiService.state.patConfig.operatorIdEnabled ? spiService.state.patConfig.allowedOperatorIds : []
                }
                selectedOperatorId={table.operatorId}
                onOperatorIdChanged={(operatorId) => {
                  dispatch(updateOperatorId({ tableId: table.tableId, operatorId }));
                }}
                payments={table.bill.payments}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Button
        onClick={() => {
          dispatch(addNewTable());
        }}
        className={classes.addButton}
        color="primary"
        variant="contained"
      >
        Add
      </Button>
    </Layout>
  );
};

export default PayAtTable;

import React, { useState, useEffect } from 'react';
import {
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Box,
  Divider,
  Grid,
} from '@material-ui/core';
import { Spi as SpiClient } from '@mx51/spi-client-js';
import { serialNumberFormatter } from '../../../utils/common/helpers';
import { isSerialNumberValid, serialNumberValidatorOnChange } from '../../../utils/validators/validators';
import CustomTextField from '../../CustomTextField';
import useStyles from './index.styles';
import { ErrorResponse, GoogleDns, IFormEventValue } from './interfaces';
import Result from './Result';

// eslint-disable-next-line @typescript-eslint/ban-types
async function getTenantsList(setTenantList: Function) {
  const tenants = await SpiClient.GetAvailableTenants('mx51-support-tool', 'mx51-support-tool', 'AU');
  const defaultTenantList = [
    {
      code: 'wbc',
      name: 'Westpac Presto',
    },
    {
      code: 'till',
      name: 'Till Payments',
    },
  ];

  const tenantList = tenants.Data.length ? tenants.Data : defaultTenantList;
  localStorage.setItem('tenants', JSON.stringify(tenantList));
  setTenantList(tenantList);
}

function webSocketFqdn(webFqdn: string, sn: string, tm: boolean, setWebSocketConnectionFqdn: (arg0: string) => void) {
  const socket = new WebSocket(`wss://${webFqdn}`, 'spi.2.9.0');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  socket.onopen = (e) => {
    socket.send('success');
    setWebSocketConnectionFqdn('Successfully connected to webSocket');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  socket.onerror = (error) => {
    setWebSocketConnectionFqdn('Error in connecting to webSocket');
  };
}

async function fetchFqdn(
  sn: string,
  tenant: string,
  tm: boolean,
  setFqdn: (arg0: string) => void,
  setTimeStampFqdn: (arg0: string) => void,
  setResult: (arg0: string) => void,
  setErrorResponse: (arg0: ErrorResponse) => void,
  setGoogleDns: (arg0: GoogleDns) => void,
  setWebSocketConnectionFqdn: (arg0: string) => void
) {
  const response = await fetch(`https://device-address-api${tm ? '-sb' : ''}.${tenant}.mspenv.io/v1/${sn}/fqdn`, {
    headers: {
      'ASM-MSP-DEVICE-ADDRESS-API-KEY': 'DADDRTESTTOOL',
    },
  });
  try {
    let fqdn;
    if (response.ok) {
      const data = await response.json();
      fqdn = data.fqdn;
      setFqdn(data.fqdn);
      setTimeStampFqdn(data.last_updated);
      setResult('success');
      webSocketFqdn(data.fqdn, sn, tm, setWebSocketConnectionFqdn);
    } else {
      const data = await response.json();
      setErrorResponse(data);
      setResult('error');
    }

    if (response.ok) {
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${fqdn}`);
      if (dnsResponse.ok) {
        const data = await dnsResponse.json();
        if (dnsResponse.ok && data.Answer) {
          setGoogleDns(data);
        } else {
          setGoogleDns({ Answer: [{ data: 'Error in Google Api', name: '' }] });
        }
      }
    }
  } catch (err) {
    // console.log(err);
  }
}

async function fetchIp(
  sn: string,
  tenant: string,
  tm: boolean,
  setIp: (arg0: string) => void,
  setTimeStampIp: (arg0: string) => void,
  setResult: (arg0: string) => void,
  setErrorResponse: (arg0: ErrorResponse) => void
) {
  const response = await fetch(`https://device-address-api${tm ? '-sb' : ''}.${tenant}.mspenv.io/v1/${sn}/ip`, {
    headers: {
      'ASM-MSP-DEVICE-ADDRESS-API-KEY': 'DADDRTESTTOOL',
    },
  });

  if (response.ok) {
    const data = await response.json();
    setIp(data.ip);
    setTimeStampIp(data.last_updated);
    setResult('success');
    // Todo
    // webSocketIp(data.ip);
  } else {
    const data = await response.json();
    setErrorResponse(data);
    setResult('error');
  }
}

function AutoAddressCheck(): React.ReactElement {
  const [serialNumber, setSerialNumber] = useState({ isValid: true, value: '' });
  const [fqdn, setFqdn] = useState('');
  const [ip, setIp] = useState('');
  const [timeStampFqdn, setTimeStampFqdn] = useState('');
  const [timeStampIp, setTimeStampIp] = useState('');
  const [selectedTenantCode, setSelectedTenantCode] = useState('');
  const [tenantList, setTenantList] = useState(JSON.parse(window.localStorage.getItem('tenants') || '[]'));
  const [otherTenantCode, setOtherTenantCode] = useState(
    !tenantList.find((tenant: Tenant) => tenant.code === selectedTenantCode) ? selectedTenantCode : ''
  );
  const [testMode, setTestMode] = useState(false);
  const [result, setResult] = useState('');
  const [errorResponse, setErrorResponse] = useState({
    request_id: '',
    error_code: 111,
    error: '',
  });
  const [googleDns, setGoogleDns] = useState({
    Answer: [{ name: '', data: '' }],
  });
  const [webSocketConnectionFqdn, setWebSocketConnectionFqdn] = useState('');
  const classes = useStyles();

  // Todo
  // const [webSocketConnectionIp, setWebSocketConnectionIp] = useState('');

  function fetchResponse(sn: string, tenant: string, tm: boolean) {
    fetchFqdn(
      sn,
      tenant,
      tm,
      setFqdn,
      setTimeStampFqdn,
      setResult,
      setErrorResponse,
      setGoogleDns,
      setWebSocketConnectionFqdn
    );
    fetchIp(sn, tenant, tm, setIp, setTimeStampIp, setResult, setErrorResponse);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serialNumberFromUrl = params.get('sn');
    const testModeFromUrl = params.get('qa');
    const tenantFromUrl = params.get('tenant');

    const sn = serialNumberFromUrl === null ? '' : serialNumberFromUrl;
    const tm = testModeFromUrl === 'true';
    setSerialNumber({ ...serialNumber, value: sn });
    setTestMode(tm);

    if (sn !== '' && tenantFromUrl) {
      fetchResponse(sn, tenantFromUrl, tm);
    }

    getTenantsList(setTenantList);
  }, []);

  // Todo
  // function webSocketIp(webIp: any) {
  //   const socket = new WebSocket(`ws://${webIp}`, `spi.${new SpiService()._version}`);
  //   socket.onopen = (e: any) => {
  //     socket.send('success');
  //     setWebSocketConnectionIp('Successfully connected to webSocket');
  //   };
  //   socket.onerror = (error: any) => {
  //     setWebSocketConnectionIp('Error in connecting to webSocket');
  //   };
  // }

  const onOtherTextChange = (event: IFormEventValue) => {
    setSelectedTenantCode('other');
    setOtherTenantCode(event.target.value as string);
  };
  const onSerialNumberChange = (event: IFormEventValue) => {
    const value = serialNumberFormatter(event.target.value as string);
    const isValid = isSerialNumberValid(value);
    setSerialNumber({ isValid, value });
  };
  const onTestModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTestMode(event.target.checked);
    setResult('');
  };
  const onTenantChange = (e: IFormEventValue) => setSelectedTenantCode(e.target.value as string);
  const onSubmitBtnClick = () => {
    const tenant = selectedTenantCode !== 'other' ? selectedTenantCode : otherTenantCode;
    fetchResponse(serialNumber.value, tenant, testMode);
  };

  const helperText = serialNumber.isValid ? '' : serialNumberValidatorOnChange(serialNumber.value);

  return (
    <Box className={classes.toolContainer}>
      <Typography component="h1" className={classes.h1}>
        Auto address check
      </Typography>
      <Typography>This support tool can be used by Merchants or L2 support users to test Auto address</Typography>
      <Divider className={classes.divider} />
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Typography component="h2" className={classes.h2}>
            Test Auto address
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <FormControl variant="outlined" margin="dense" fullWidth data-test-id="autoAddressTenantForm">
            <InputLabel data-test-id="autoAddressTenantFormLabel">Tenant</InputLabel>
            <Select
              data-test-id="autoAddressTenantSelectorLabel"
              label="Tenant"
              labelId="autoAddressTenantDropDownLabel"
              value={selectedTenantCode}
              onChange={onTenantChange}
            >
              {tenantList.map((tenant: Tenant) => (
                <MenuItem key={tenant.code} value={tenant.code}>
                  {tenant.name}
                </MenuItem>
              ))}
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <Typography className={classes.infoText}>Select the tenant for the Auto address test</Typography>
          {selectedTenantCode === 'other' && (
            <CustomTextField
              dataTestId="autoAddressTenantField"
              fullWidth
              label="Other"
              margin="dense"
              onBlur={onOtherTextChange}
              onChange={onOtherTextChange}
              value={otherTenantCode}
              variant="outlined"
            />
          )}
          <CustomTextField
            dataTestId="autoAddressSerialNumberField"
            fullWidth
            label="Serial Number"
            margin="dense"
            error={!serialNumber.isValid}
            helperText={helperText}
            onChange={onSerialNumberChange}
            onBlur={onSerialNumberChange}
            required
            value={serialNumber.value}
            variant="outlined"
          />
          <Typography className={classes.infoText}>Enter terminal serial number</Typography>
          <FormGroup className={classes.testMode}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={testMode}
                  onChange={onTestModeChange}
                  data-test-id="autoAddressCheckbox"
                  color="primary"
                  name="testMode"
                />
              }
              label="Test mode"
            />
          </FormGroup>
          <Button
            className={classes.submitBtn}
            color="primary"
            data-test-id="autoAddressSubmitButton"
            onClick={onSubmitBtnClick}
            variant="contained"
          >
            Test Auto address
          </Button>
        </Grid>
      </Grid>
      <Result
        fqdn={fqdn}
        ip={ip}
        timeStampFqdn={timeStampFqdn}
        testMode={testMode}
        result={result}
        errorResponse={errorResponse}
        googleDns={googleDns}
        webSocketConnectionFqdn={webSocketConnectionFqdn}
        timeStampIp={timeStampIp}
      />
    </Box>
  );
}

export default AutoAddressCheck;

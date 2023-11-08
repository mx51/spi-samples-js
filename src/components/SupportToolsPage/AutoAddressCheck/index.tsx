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
import { serialNumberValidatorOnChange } from '../../../utils/validators/validators';
import CustomTextField from '../../CustomTextField';
import useStyles from './index.styles';
import { ErrorResponse, GoogleDns, IFormEventValue } from './interfaces';
import Result from './Result';
import {
  TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD,
  acquirerCodeToEnvOptions,
  deviceAddressEnv,
} from '../../../definitions/constants/commonConfigs';

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

function webSocketFqdn(webFqdn: string, sn: string, tm: boolean, setWebSocketConnectionFqdn: (value: string) => void) {
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

function environmentSetter(tm: boolean, selectedEnvironment: string) {
  const isTestMode = tm ? '-sb' : '';
  return selectedEnvironment ? `-${selectedEnvironment}` : isTestMode;
}

async function fetchFqdn(
  sn: string,
  tenant: string,
  tm: boolean,
  setFqdn: (value: string) => void,
  setTimeStampFqdn: (value: string) => void,
  setResult: (value: string) => void,
  setErrorResponse: (value: ErrorResponse) => void,
  setGoogleDns: (value: GoogleDns) => void,
  setWebSocketConnectionFqdn: (value: string) => void,
  selectedEnvironment: string
) {
  try {
    const response = await fetch(
      `https://device-address-api${environmentSetter(tm, selectedEnvironment)}.${tenant}.mspenv.io/v1/${sn}/fqdn`,
      {
        headers: {
          'ASM-MSP-DEVICE-ADDRESS-API-KEY': 'DADDRTESTTOOL',
        },
      }
    );
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
  } catch (error: any) {
    const data = {
      error: error.message,
      error_code: 401,
      request_id: '',
    };
    setErrorResponse(data);
    setResult('error');
  }
}

async function fetchIp(
  sn: string,
  tenant: string,
  tm: boolean,
  setIp: (value: string) => void,
  setTimeStampIp: (value: string) => void,
  setResult: (value: string) => void,
  setErrorResponse: (value: ErrorResponse) => void,
  selectedEnvironment: string
) {
  try {
    const response = await fetch(
      `https://device-address-api${environmentSetter(tm, selectedEnvironment)}.${tenant}.mspenv.io/v1/${sn}/ip`,
      {
        headers: {
          'ASM-MSP-DEVICE-ADDRESS-API-KEY': 'DADDRTESTTOOL',
        },
      }
    );

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
  } catch (error: any) {
    const data = {
      error: error.message,
      error_code: 401,
      request_id: '',
    };
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
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
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
      setWebSocketConnectionFqdn,
      selectedEnvironment
    );
    fetchIp(sn, tenant, tm, setIp, setTimeStampIp, setResult, setErrorResponse, selectedEnvironment);
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

  const onSerialNumberChange = (event: IFormEventValue) => {
    const value = event.target.value as string;
    const isValid = serialNumberValidatorOnChange(value) === '';
    setSerialNumber({ isValid, value });
  };
  const onTestModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTestMode(event.target.checked);
    setResult('');
  };
  const onTenantChange = (e: IFormEventValue) => {
    setOtherTenantCode('');
    setSelectedEnvironment('');
    setSelectedTenantCode(e.target.value as string);
  };
  const onSubmitBtnClick = () => {
    const tenant = selectedTenantCode !== 'other' ? selectedTenantCode : otherTenantCode;
    fetchResponse(serialNumber.value, tenant, testMode);
  };

  const helperText = serialNumber.isValid ? '' : serialNumberValidatorOnChange(serialNumber.value);

  const envOptions = acquirerCodeToEnvOptions[otherTenantCode] ?? [];
  const onOtherTextChange = (event: IFormEventValue) => {
    setSelectedTenantCode('other');
    setOtherTenantCode(event.target.value as string);
    const newEnvOptions = acquirerCodeToEnvOptions[event.target.value as string] ?? [];
    if (newEnvOptions.length === 0) {
      setSelectedEnvironment('');
    } else if (newEnvOptions.length === 1) {
      setSelectedEnvironment(deviceAddressEnv.rnd);
    }
  };
  const onEnvironmentChange = (e: IFormEventValue) => setSelectedEnvironment(e.target.value as string);

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
              value={selectedTenantCode ?? ''}
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
              error={!otherTenantCode}
              helperText={!otherTenantCode ? TEXT_FORM_VALIDATION_PROVIDER_TEXTFIELD : ''}
              variant="outlined"
            />
          )}
          {envOptions.length >= 1 ? (
            <Grid item className={classes.fieldSpace}>
              <FormControl variant="outlined" margin="dense" fullWidth data-test-id="environment">
                <InputLabel data-test-id="environmentLabel">Environment</InputLabel>
                <Select
                  className={classes.pairFormSelector}
                  data-test-id="configurationSelector"
                  disabled={envOptions.length === 1}
                  label="Environment"
                  labelId="environmentDropdownLabel"
                  onChange={onEnvironmentChange}
                  value={selectedEnvironment ?? ''}
                >
                  {envOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : null}
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
                  disabled={envOptions.length > 0}
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

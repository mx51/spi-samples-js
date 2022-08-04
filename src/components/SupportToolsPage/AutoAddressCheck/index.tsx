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
} from '@material-ui/core';
import { Spi as SpiClient } from '@mx51/spi-client-js';
import { serialNumberFormatter } from '../../../utils/common/helpers';
import { isSerialNumberValid, serialNumberValidatorOnChange } from '../../../utils/validators/validators';
import CustomTextField from '../../CustomTextField';
import useStyles from './index.styles';
import { IFormEventValue } from './interfaces';

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

function webSocketFqdn(webFqdn: any, sn: string, tm: boolean, setWebSocketConnectionFqdn: any) {
  const socket = new WebSocket(`wss://${webFqdn}`, 'spi.2.9.0');

  socket.onopen = (e: any) => {
    socket.send('success');
    setWebSocketConnectionFqdn('Successfully connected to webSocket');
  };

  socket.onerror = (error: any) => {
    setWebSocketConnectionFqdn('Error in connecting to webSocket');
  };
}

async function fetchFqdn(
  sn: string,
  tenant: string,
  tm: boolean,
  setFqdn: any,
  setTimeStampFqdn: any,
  setResult: any,
  setErrorResponse: any,
  setGoogleDns: any,
  setWebSocketConnectionFqdn: any
) {
  const response = await fetch(`https://device-address-api${tm ? '-sb' : ''}.${tenant}.mspenv.io/v1/${sn}/fqdn`, {
    headers: {
      'ASM-MSP-DEVICE-ADDRESS-API-KEY': 'DADDRTESTTOOL',
    },
  });
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
        console.log(data);
      } else {
        setGoogleDns('Error in Google Api');
      }
    }
  }
}

async function fetchIp(
  sn: string,
  tenant: string,
  tm: boolean,
  setIp: any,
  setTimeStampIp: any,
  setResult: any,
  setErrorResponse: any
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

function AutoAddressCheck() {
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
  };

  const helperText = serialNumber.isValid ? '' : serialNumberValidatorOnChange(serialNumber.value);

  return (
    <div>
      <Typography className={classes.subHeader}>L2 Support and/or Merchants to test auto address</Typography>
      <FormControl variant="outlined" margin="dense" fullWidth data-test-id="supportTenantForm">
        <InputLabel data-test-id="supportTenantFormLabel">Select a tenant</InputLabel>
        <Select
          className={classes.selecter}
          data-test-id="supportTenantSelectorLabel"
          value={selectedTenantCode}
          onChange={(e: IFormEventValue) => setSelectedTenantCode(e.target.value as string)}
        >
          {tenantList.map((tenant: Tenant) => (
            <MenuItem key={tenant.code} value={tenant.code}>
              {tenant.name}
            </MenuItem>
          ))}
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      {selectedTenantCode === 'other' && (
        <CustomTextField
          dataTestId="tenantField"
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
        dataTestId="serialNumberField"
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
      <FormGroup>
        <FormControlLabel control={<Checkbox checked={testMode} onChange={onTestModeChange} />} label="Test" />
      </FormGroup>
    </div>
  );
}

export default AutoAddressCheck;

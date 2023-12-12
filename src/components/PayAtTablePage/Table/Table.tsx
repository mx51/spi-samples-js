import React from 'react';
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Input,
  IconButton,
  styled,
  FormGroup,
  FormControlLabel,
  Switch,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { CloseOutlined, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import currencyFormat from '../../../utils/common/intl/currencyFormatter';
import { Payment } from '../../../redux/reducers/PayAtTableSlice/payAtTableSlice';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconButton {...other} />;
})(({ theme, expand }: Any) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Props {
  totalAmount: number;
  dueAmount: number;
  title: string;
  locked: boolean;
  operatorIds: string[];
  // eslint-disable-next-line react/require-default-props
  selectedOperatorId?: string;
  payments: Payment[];
  onToggleLocked: () => void;
  onNewCostAdded: (cost: number) => void;
  onClose: () => void;
  onOperatorIdChanged: (operatorId: string) => void;
}

export const Table: React.FC<Props> = ({
  onNewCostAdded,
  onToggleLocked,
  onClose,
  onOperatorIdChanged,
  totalAmount,
  dueAmount,
  title,
  locked,
  operatorIds,
  selectedOperatorId = '',
  payments,
}) => {
  const [operatorId, setOperatorId] = React.useState(selectedOperatorId);
  const [expanded, setExpanded] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const handleExpandClick = () => setExpanded(!expanded);

  const paidAmount = totalAmount - dueAmount;
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOperatorId(event.target.value as string);
    onOperatorIdChanged(event.target.value as string);
  };

  return (
    <Card>
      <CardHeader
        title={title}
        action={
          <IconButton onClick={onClose} aria-label="Close table">
            <CloseOutlined />
          </IconButton>
        }
      />
      <CardContent>
        <Typography variant="body1" component="p">
          {`Total: ${currencyFormat(totalAmount / 100)}`}
        </Typography>
        <Typography variant="body1" component="p">
          {`Paid: ${currencyFormat(paidAmount / 100)}`}
        </Typography>
        <Typography variant="body1" component="p">
          {`Due: ${currencyFormat(dueAmount / 100)}`}
        </Typography>
        <Input
          fullWidth
          value={amount}
          disabled={locked}
          onKeyUp={(e) => {
            e.preventDefault();

            if (e.key === 'Enter' && amount) {
              onNewCostAdded(amount * 100);
              setAmount(0);
            }
          }}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Add cost"
          type="number"
        />
        {operatorIds.length > 0 ? (
          <FormControl disabled={locked} variant="standard" fullWidth>
            <InputLabel id="demo-simple-select-standard-label">OperatorId</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={operatorId}
              onChange={handleChange}
              label="OperatorId"
            >
              {operatorIds.map((id) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={locked}
                onChange={() => {
                  onToggleLocked();
                }}
              />
            }
            label="Locked"
          />
        </FormGroup>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography align="center" paragraph>
            {payments.length > 0 ? 'Payments' : 'No payments'}
          </Typography>
          {payments.map((payment) => (
            <div key={payment.terminalRefId}>
              <Typography variant="body1" component="p">
                {`${currencyFormat(payment.purchaseAmount / 100)} by ${payment.paymentType}`}
              </Typography>
            </div>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

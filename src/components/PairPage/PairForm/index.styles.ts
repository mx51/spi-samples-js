import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      '& .MuiInputBase-input': {
        textOverflow: 'ellipsis',
      },
    },
    '.MuiFormHelperText-contained, .MuiFormHelperText-root.Mui-error': {
      margin: 0,
    },
    spiBtn: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: 300,
      marginTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
    saveBtn: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: 300,
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
    columnSpace: {
      paddingRight: theme.spacing(2),
    },
    configurationLabel: {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    pairFormSelector: {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.info.main,
      },
    },
    [theme.breakpoints.between(960, 1024)]: {
      formContainer: {
        paddingRight: theme.spacing(4),
      },
    },
    [theme.breakpoints.between(600, 959)]: {
      formContainer: {
        paddingRight: theme.spacing(2),
      },
    },
    [theme.breakpoints.down(600)]: {
      columnSpace: {
        paddingRight: 0,
      },
      paymentProvider: {
        paddingRight: theme.spacing(2),
      },
    },
    [theme.breakpoints.between(600, 768)]: {
      formContainer: {
        '& .MuiTextField-root, & .MuiFormControl-root': {
          '&>.MuiInputLabel-root': {
            width: '80%', // for handling text truncate when text is too long
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
      },
    },
  })
);

export default useStyles;

import { Theme, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const textFieldStyles = (theme: Theme) => ({
  root: {
    '& .MuiOutlinedInput-input': {
      cursor: 'pointer',
    },
    '& .MuiOutlinedInput-input:disabled': {
      cursor: 'not-allowed',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.info.main,
    },
    '& .MuiOutlinedInput-root.Mui-focused:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.text.hint,
    },
    '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
    },
  },
});

const ThemeTextField = withStyles(textFieldStyles, { withTheme: true })(TextField);

export default ThemeTextField;

import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  createStyles,
  makeStyles,
  Input,
  Step,
  Stepper,
  StepLabel,
} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#cf77d9',
      light: '#cf77d9',
      dark: '#fff',
      contrastText: '#fff',
    },
    secondary: {
      main: '#e6e6e6',
      dark: '#2c2a47',
    },
  },
});

const steps = [
  'Provide Canvas API Token',
  'Authorize access to your Google Calendar',
];

const getStep = (stepIndex: number) => {
  return steps[stepIndex];
};

const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      color: 'white',
    },
  })
);

function App() {
  const [activeStep, setActiveStep] = React.useState(0);

  const [calendarID, setCalendarID] = React.useState('');
  React.useEffect(() => {
    chrome.storage.local.get(['calendarID'], function (result) {
      console.log(result.calendarID);
      setCalendarID(result.calendarID);
    });
  }, []);

  const classes = useStyles();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const setCalendarSummary = () => {};
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header style={{ paddingBottom: 20 }}>
          <h1>CalPal</h1>
          <small>Automating assignments, a few clicks away...</small>
        </header>
        <Input
          id="calendarid"
          className={classes.input}
          value={calendarID}
          color="secondary"
          placeholder="Calendar ID"
        ></Input>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            chrome.storage.local.set({
              calendarID: (document.getElementById('calendarid') as any).value,
            });
            chrome.storage.local.get(['calendarID'], function (result) {
              console.log(result.calendarSummary);
            });
            setTimeout(chrome.runtime.reload, 1000);
          }}
        >
          Save
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App;

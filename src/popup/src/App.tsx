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

let calendarid: string;

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
    btn: {
      '&:hover': {
        backgroundColor: '#d69bdd',
      },
    },
  })
);

const App = () => {
  const [calendarID, setCalendarID] = React.useState('');
  React.useEffect(() => {
    chrome.storage.local.get(['calendarID'], function (result) {
      console.log('calendarid: ', result);
      setCalendarID(result.calendarID);
    });
  }, []);

  const classes = useStyles();

  chrome.storage.local.get(['calendarID'], function (result) {
    calendarid = result.calendarID;
    console.log(calendarid);
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header style={{ paddingBottom: 20 }}>
          <h1>CalPal</h1>
          <small>Automating assignments, a few clicks away...</small>
        </header>
        {calendarid === '' && (
          <div>
            <Input
              id="calendarid"
              className={classes.input}
              value={calendarID}
              color="secondary"
              placeholder="Calendar ID"
              onChange={(e) => setCalendarID(e.target.value)}
            ></Input>

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                chrome.storage.local.set({
                  calendarID: (document.getElementById('calendarid') as any)
                    .value,
                });
                chrome.storage.local.get(['calendarID'], function (result) {
                  console.log(result.calendarSummary);
                });
                setTimeout(chrome.runtime.reload, 1000);
              }}
              className={classes.btn}
            >
              Save
            </Button>
          </div>
        )}
        {!!calendarid && calendarid != '' && (
          <Button variant="contained" color="primary" className={classes.btn}>
            Reschedule
          </Button>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;

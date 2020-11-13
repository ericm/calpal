import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Button, TextField, createStyles, makeStyles, Step, Stepper, StepLabel } from "@material-ui/core";


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#cf77d9',
      light: '#cf77d9'
    },
    secondary: {
      main: '#e6e6e6',
      dark: '#2c2a47'
    },
  }
})

const steps = ["Provide Canvas API Token", "Authorize access to your Google Calendar"]

const getStep = (stepIndex: number) => {
  return steps[stepIndex]
}

const useStyles = makeStyles((theme) =>
  createStyles({
    input: {
      color: "white"
    }
  }),
);

function App() {
  const [activeStep, setActiveStep] = React.useState(0);

  const classes = useStyles();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header>
          <h1>CalPal</h1>
          <small>Automating assignments, a few clicks away...</small>
        </header>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div>
          <TextField id="input-with-icon-grid" label="Canvas API Token" color="primary" InputProps={{ className: classes.input }} />
          <Button onClick={handleNext} color="primary" variant="contained">Next</Button>
          <Button onClick={handleBack} color="secondary" variant="contained">Back</Button>

        </div>

        <div className="oauthGrant">
          <Button onClick={handleNext} color="primary" variant="contained">Authorize google calendar</Button>

        </div>
      </div >
    </ThemeProvider>
  );
}

export default App;

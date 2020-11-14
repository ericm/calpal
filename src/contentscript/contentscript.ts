import './contentscript.scss';
import * as utils from '../utils';

// Init canvas.
const intialSetup = () => {
  chrome.storage.local.set({
    canvas: {
      token: '',
    },
  });
};

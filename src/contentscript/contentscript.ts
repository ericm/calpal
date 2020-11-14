import './contentscript.scss';
import * as utils from '../utils';

const isThisContentscript = true;
console.log('isThisContentscript', isThisContentscript);

const intialSetup = () => {
  chrome.storage.local.set({
    canvas: {
      token: '',
    },
  });
};

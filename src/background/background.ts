import * as utils from '../utils';

const isThisBackground = true;
// console.log('isThisBackground', isThisBackground);

let canvas;

class Canvas {
  private $token: string;
  constructor(token: string) {
    this.$token = token;
  }
  async get<T>(slug: string): Promise<T> {
    return utils.request<T>({
      Method: 'GET',
      URL: utils.URL.canvas,
      Slug: slug + '?access_token=' + canvas.$token,
      CORS: 'no-cors',
    });
  }
  async post<T>(slug: string): Promise<T> {
    return utils.request<T>({
      Method: 'GET',
      URL: utils.URL.canvas,
      Slug: slug + '?access_token=' + canvas.token,
      CORS: 'no-cors',
    });
  }
}

chrome.identity.getAuthToken({ interactive: true }, (token) => {
  // console.log(token);
});

const setValues = () => {
  chrome.storage.local.set({
    canvas: {
      token: 'TOKEN GOES HERE',
    },
  });
};

async function init() {
  await console.log(canvas.get('/courses'));
}

init();

interface Course {
  ID: string;
}

import './contentscript.scss';

const isThisContentscript = true;
console.log('isThisContentscript', isThisContentscript);

const intialSetup = () => {
  chrome.storage.local.set({
    canvas: {
      token: '',
    },
  });
};

enum URL {
  canvas = 'https://ucc.instructure.com',
  calendar = 'https://www.googleapis.com/auth/calendar',
}
interface ReqProps {
  Method: 'GET' | 'POST';
  Slug: string;
  URL: URL;
}

async function request<T extends Object>(props: ReqProps): Promise<T> {
  const resp = await fetch(props.URL, { method: props.Method });
  const body = (await resp.json()) as T;
  return body;
}

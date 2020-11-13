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

interface ReqProps {
  Method: string;
  URL: string;
}

async function request(props: ReqProps): Promise<any> {
  const resp = await fetch(props.URL, { method: props.Method });
  const body = await resp.json();
  return body;
}

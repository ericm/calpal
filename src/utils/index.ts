export enum URL {
  canvas = 'https://ucc.instructure.com/api/v1',
  calendar = 'https://www.googleapis.com/calendar/v3/',
}

export interface ReqProps {
  Method: 'GET' | 'POST';
  Headers?: Headers;
  Slug: string;
  URL: URL;
  CORS: 'cors' | 'no-cors';
}

export async function request<T extends Object>(props: ReqProps): Promise<T> {
  const resp = await fetch(props.URL + props.Slug, {
    method: props.Method,
    headers: props.Headers,
    mode: props.CORS,
  });
  try {
    const body = (await resp.json()) as T;
    return body;
  } catch (e) {
    console.error(e);
  }
}

export enum URL {
  canvas = 'https://ucc.instructure.com/',
  calendar = 'https://www.googleapis.com/calendar/v3/',
}

export interface ReqProps {
  Method: 'GET' | 'POST';
  Headers?: Headers;
  Slug: string;
  URL: URL;
}

export async function request<T extends Object>(props: ReqProps): Promise<T> {
  const resp = await fetch(props.URL + props.Slug, {
    method: props.Method,
    headers: props.Headers,
  });
  try {
    const body = (await resp.json()) as T;
    return body;
  } catch (e) {
    console.error(e);
  }
}

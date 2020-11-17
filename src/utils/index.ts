export enum URL {
  canvas = 'https://ucc.instructure.com/api/v1',
  calendar = 'https://www.googleapis.com/calendar/v3/',
}

export interface ReqProps {
  Method: 'GET' | 'POST' | 'PATCH';
  Headers?: Headers;
  Slug: string;
  URL: URL;
}

export async function request<T extends Object>(
  props: ReqProps,
  body?: BodyInit
): Promise<T> {
  const resp = await fetch(props.URL + props.Slug, {
    method: props.Method,
    headers: props.Headers,
    body: body,
  });
  try {
    const body = (await resp.json()) as T;
    return body;
  } catch (e) {
    console.error(e);
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function diffMinutes(d1: Date, d2: Date): number {
  return Math.floor(Math.abs(d1.getTime() - d2.getTime()) / 1000 / 60);
}

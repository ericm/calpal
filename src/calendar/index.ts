import { URL, ReqProps, request } from '../utils';

export interface CalendarList {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  description: string;
  location: string;
  timeZone: string;
  summaryOverride: string;
  colorId: string;
  backgroundColor: string;
  foregroundColor: string;
  hidden: boolean;
  selected: boolean;
  accessRole: string;
  defaultReminders: [
    {
      method: string;
      minutes: number;
    }
  ];
  notificationSettings: {
    notifications: [
      {
        type: string;
        method: string;
      }
    ];
  };
  primary: boolean;
  deleted: boolean;
  conferenceProperties: {
    allowedConferenceSolutionTypes: [string];
  };
}

export interface CalendarListList {
  kind: string;
  etag: string;
  nextPageToken: string;
  items: CalendarList[];
  nextSyncToken: string;
}

export default class {
  private $token: string;
  private $list: CalendarList[];

  constructor(token: string) {
    this.$token = token;
  }

  private headers(): Headers {
    return new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.$token}`,
    });
  }

  private async get<T>(slug: string): Promise<T> {
    return await request<T>({
      Method: 'GET',
      URL: URL.calendar,
      Slug: slug,
      Headers: this.headers(),
    });
  }

  private async post<T>(slug: string): Promise<T> {
    return await request<T>({
      Method: 'POST',
      URL: URL.calendar,
      Slug: slug,
      Headers: this.headers(),
    });
  }

  public async getCalendars(): Promise<CalendarListList> {
    const list = await this.get<CalendarListList>('users/me/calendarList');
    this.$list = list.items;
    return list;
  }
}

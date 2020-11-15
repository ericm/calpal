import { throws } from 'assert';
import { Assignment } from '../canvas';
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

export interface Event {
  kind: 'calendar#event';
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  colorId: string;
  creator: {
    id: string;
    email: string;
    displayName: string;
    self: boolean;
  };
  organizer: {
    id: string;
    email: string;
    displayName: string;
    self: boolean;
  };
  start: {
    date: string;
    dateTime: string;
    timeZone: string;
  };
  end: {
    date: string;
    dateTime: string;
    timeZone: string;
  };
  endTimeUnspecified: boolean;
  recurrence: [string];
  recurringEventId: string;
  originalStartTime: {
    date: string;
    dateTime: string;
    timeZone: string;
  };
  transparency: string;
  visibility: string;
  iCalUID: string;
  sequence: number;
  attendees: [
    {
      id: string;
      email: string;
      displayName: string;
      organizer: boolean;
      self: boolean;
      resource: boolean;
      optional: boolean;
      responseStatus: string;
      comment: string;
      additionalGuests: number;
    }
  ];
  attendeesOmitted: boolean;
  extendedProperties: {
    private: {
      (key): string;
    };
    shared: {
      (key): string;
    };
  };
  hangoutLink: string;
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
      status: {
        statusCode: string;
      };
    };
    entryPoints: [
      {
        entryPointType: string;
        uri: string;
        label: string;
        pin: string;
        accessCode: string;
        meetingCode: string;
        passcode: string;
        password: string;
      }
    ];
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
    signature: string;
    notes: string;
  };
  gadget: {
    type: string;
    title: string;
    link: string;
    iconLink: string;
    width: number;
    height: number;
    display: string;
    preferences: {
      (key): string;
    };
  };
  anyoneCanAddSelf: boolean;
  guestsCanInviteOthers: boolean;
  guestsCanModify: boolean;
  guestsCanSeeOtherGuests: boolean;
  privateCopy: boolean;
  locked: boolean;
  reminders: {
    useDefault: boolean;
    overrides: [
      {
        method: string;
        minutes: number;
      }
    ];
  };
  source: {
    url: string;
    title: string;
  };
  attachments: [
    {
      fileUrl: string;
      title: string;
      mimeType: string;
      iconLink: string;
      fileId: string;
    }
  ];
}

export interface EventsList {
  kind: 'calendar#events';
  etag: string;
  summary: string;
  description: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: [
    {
      method: string;
      minutes: number;
    }
  ];
  nextPageToken: string;
  nextSyncToken: string;
  items: Event[];
}

export interface EventAdd {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export interface FreeBusyReq {
  timeMin: string;
  timeMax: string;
  timeZone?: string;
  groupExpansionMax?: number;
  calendarExpansionMax?: number;
  items: {
    id: string;
  }[];
}

export interface FreeBusy {
  kind: 'calendar#freeBusy';
  timeMin: string;
  timeMax: string;
  groups: {
    [key: string]: {
      errors: [
        {
          domain: string;
          reason: string;
        }
      ];
      calendars: [string];
    };
  };
  calendars: {
    [key: string]: {
      errors: {
        domain: string;
        reason: string;
      }[];
      busy: {
        start: string;
        end: string;
      }[];
    };
  };
}

const addDays = function (date: Date, days: number) {
  date.setDate(date.getDate() + days);
  return date;
};
function diff_hours(dt2: Date, dt1: Date): number {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

export default class Calendar {
  static DEFAULT_HOURS = 2;
  static DAY_START = 9;
  static DAY_END = 18;

  private $token: string;
  private $list: CalendarList[];
  private $eventsList: Event[];
  private $selected = 0;
  private $id?: string;
  private $canvas?: Calendar;

  constructor(token: string, id?: string) {
    this.$token = token;
    if (id) {
      this.$id = id;
    }
  }

  public set list(list: CalendarList[]) {
    this.$list = list;
  }

  private headers(): Headers {
    return new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.$token}`,
    });
  }

  public async createCanvas(): Promise<Calendar> {
    let canvasID = await this.getCanvasID();
    if (canvasID != '') {
      const canvas = new Calendar(this.$token, canvasID);
      canvas.list = this.$list;
      this.$canvas = canvas;
      return canvas;
    } else {
      return null;
    }
  }

  public async getCanvasID(): Promise<string> {
    return new Promise<string>((resolve) => {
      chrome.storage.local.get(['calendarID'], function (result) {
        if (!!result.calendarID) {
          resolve(result.calendarID);
        } else {
          resolve('');
        }
      });
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

  private async post<T, S = {}>(slug: string, body: S): Promise<T> {
    const bodyReq = JSON.stringify(body);
    return await request<T>(
      {
        Method: 'POST',
        URL: URL.calendar,
        Slug: slug,
        Headers: this.headers(),
      },
      bodyReq
    );
  }

  private async patch<T, S = {}>(slug: string, body: S): Promise<T> {
    const bodyReq = JSON.stringify(body);
    return await request<T>(
      {
        Method: 'PATCH',
        URL: URL.calendar,
        Slug: slug,
        Headers: this.headers(),
      },
      bodyReq
    );
  }

  public async getCalendars(): Promise<CalendarListList> {
    const list = await this.get<CalendarListList>('users/me/calendarList');
    this.$list = list.items;
    return list;
  }

  public getCalendar(): CalendarList {
    if (this.$id) {
      return this.$list.find((val) => val.id === this.$id);
    }
    if (this.$list?.length > this.$selected) {
      return this.$list[this.$selected];
    }
    throw new Error(`Couldn't find calendar ${this.$selected}`);
  }

  public async getEvents(): Promise<EventsList> {
    const list = await this.get<EventsList>(
      `calendars/${this.getCalendar().id}/events?timeMin=${new Date(
        Date.now() - 600000000
      ).toISOString()}`
    );
    this.$eventsList = list.items;
    return list;
  }

  public async createEvent(event: EventAdd): Promise<Event> {
    return await this.post<Event, EventAdd>(
      `calendars/${this.getCalendar().id}/events`,
      event
    );
  }

  public async modifyEvent(event: EventAdd, id: string): Promise<Event> {
    return await this.patch<Event, EventAdd>(
      `calendars/${this.getCalendar().id}/events/${id}`,
      event
    );
  }

  public async getFreeBusy(due: Date): Promise<FreeBusy> {
    const body: FreeBusyReq = {
      timeMin: new Date().toISOString(),
      timeMax: due.toISOString(),
      items: [{ id: this.getCalendar().id }],
    };
    return await this.post('freeBusy', body);
  }

  public async notifyUser(due: Date): Promise<boolean> {
    let not = new Notification('CalPal', {
      body: 'Are you finished your assignment? Want to schedule more time?',
    });
    return false;
  }

  public async freeSpot(assignment: Assignment) {
    let events = (await this.getEvents()).items;
    events = events.concat((await this.$canvas!!.getEvents()).items);
    events = events.sort(
      (event, next) =>
        new Date(event.end.dateTime ?? event.end.date).getTime() -
        new Date(next.end.dateTime ?? next.end.date).getTime()
    );
    events = events.filter(
      (event) => new Date(event.end.dateTime ?? event.end.date) > new Date()
    );
    if (!assignment.duration) {
      assignment.duration = Calendar.DEFAULT_HOURS;
    }

    const numDays =
      Math.abs(assignment.due.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    let maxSpace: { start: Date; end: Date; diff: number };
    for (let i = 0; i < events.length - 1; i++) {
      const event = events[i];
      const nextEvent = events[i + 1];
      const end = new Date(event.end.dateTime ?? event.end.date);
      if (end > assignment.due) {
        break;
      }
      const start = new Date(nextEvent.start.dateTime ?? nextEvent.start.date);
      const hours = diff_hours(start, end);
      if (
        start.getHours() < Calendar.DAY_START ||
        end.getHours() < Calendar.DAY_END
      ) {
        continue;
      }
      if (hours > assignment.duration && start.getDate() == end.getDate()) {
        if (maxSpace) {
          if (hours > maxSpace.diff) {
            maxSpace = { start, end, diff: hours };
          }
        } else {
          maxSpace = { start, end, diff: hours };
        }
      }
    }
    console.log(maxSpace);
    if (!maxSpace && assignment.duration > 1) {
      assignment.duration--;
      await this.freeSpot(assignment);
    }
  }
}

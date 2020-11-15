import Calendar from '../calendar';

export interface Assignment {
  title: string;
  due: Date;
  summary: string;
  link: string;
  duration?: number;
}

export default class Canvas {
  constructor(private $calendar: Calendar) {}
  public async getAssignments(): Promise<Assignment[]> {
    let events = (await this.$calendar.getEvents()).items;
    events = events.filter((val) => val.start.date === val.end.date); // Assignemnts are 0 length.
    const assignments: Assignment[] = [];
    for (let event of events) {
      assignments.push({
        title: event.status,
        due: new Date(event.end.date),
        summary: event.description,
        link: event.htmlLink,
      });
    }
    return assignments;
  }
}

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
    console.log(this);
    let events = (await this.$calendar.getEvents()).items;
    events = events.filter(
      (val) =>
        val.iCalUID.indexOf('assignment') > 0 &&
        new Date(val.end.dateTime ?? val.end.date) > new Date()
    ); // Assignemnts are 0 length.
    const assignments: Assignment[] = [];
    for (let event of events) {
      assignments.push({
        title: event.summary,
        due: new Date(event.end.dateTime ?? event.end.date),
        summary: event.description,
        link: event.htmlLink,
      });
    }
    return assignments;
  }
}

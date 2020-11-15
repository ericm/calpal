import Calendar, { EventAdd } from '../calendar';
import Canvas from '../canvas';

// Init calendar.
chrome.identity.getAuthToken({ interactive: true }, async (token) => {
  const calendar = new Calendar(token);
  const cals = await calendar.getCalendars();
  const canvas = new Canvas(await calendar.createCanvas());
  const assignments = await canvas.getAssignments();
  console.log(assignments);

  console.log('Calendars:', cals.items);
  const events = (await calendar.getEvents()).items;

  const date = new Date();
  date.setMonth(12);
  calendar.freeSpot({
    title: 'test',
    due: date,
    summary: 'gem',
    link: 'https//google.com',
  });

  for (let assignment of assignments) {
    const event = events.find((val) => val.htmlLink === assignment.link);
    if (!event) {
      console.log('Creating event', assignment);
      //  const add: EventAdd = {
      //    summary: assignment.summary
      //  }
      //  calendar.createEvent()
    }
  }
});

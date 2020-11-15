import Calendar, { EventAdd } from '../calendar';
import Canvas from '../canvas';

// Init calendar.
chrome.identity.getAuthToken({ interactive: true }, async (token) => {
  const calendar = new Calendar(token);
  const cals = await calendar.getCalendars();
  const canvas = new Canvas(await calendar.createCanvas());
  chrome.storage.local.get(['calendarID'], function (result) {
    console.log(result.calendarID);
  });
  console.log(canvas);
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
    const event = events.find((val) => val.summary === assignment.title);
    if (!event) {
      console.log('Creating event', assignment);
      await calendar.freeSpot(assignment);
    }
  }
});

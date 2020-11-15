import Calendar, { EventAdd } from '../calendar';
import Canvas from '../canvas';
import * as utils from '../utils';
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

  for (let assignment of assignments) {
    const event = events.find((val) => val.summary === assignment.title);
    if (!event) {
      console.log('Creating event', assignment);
      await calendar.freeSpot(assignment);
      await utils.sleep(5000);
    }
  }
});

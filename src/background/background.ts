import Calendar, { EventAdd } from '../calendar';
import Canvas, { Assignment } from '../canvas';
import * as utils from '../utils';

const DIFF = 5;
const store: { [ass: string]: boolean } = {};

// Init calendar.
chrome.identity.getAuthToken({ interactive: true }, async (token) => {
  chrome.identity.getProfileUserInfo(async (user) => {
    console.log(user);
    const calendar = new Calendar(token, user.email);
    const cals = await calendar.getCalendars();
    const canvas = new Canvas(await calendar.createCanvas());
    while (true) {
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
          assignment.due.setDate(assignment.due.getDate() - 1);
          if (!(await calendar.freeSpot(assignment))) {
            assignment.due.setDate(assignment.due.getDate() + 1);
            await calendar.freeSpot(assignment);
          }
          await utils.sleep(5000);
        } else if (
          utils.diffMinutes(assignment.due, new Date()) < DIFF &&
          !store[assignment.title]
        ) {
          console.log('NOTIFYING', assignment);
          store[assignment.title] = true;
          calendar.notifyUser(assignment);
        }
      }
      await utils.sleep(60000);
    }
  });
});

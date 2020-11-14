import Calendar from '../calendar';
const isThisBackground = true;
console.log('isThisBackground', isThisBackground);

// Init calendar.
chrome.identity.getAuthToken({ interactive: true }, async (token) => {
  const calendar = new Calendar(token);
  const cals = await calendar.getCalendars();
  console.log('Calendars:', cals.items);
});

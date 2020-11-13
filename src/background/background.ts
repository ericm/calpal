const isThisBackground = true;
console.log('isThisBackground', isThisBackground);

chrome.identity.getAuthToken({ interactive: true }, (token) => {
  console.log(token);
});

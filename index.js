const express = require('express');
const { refreshCookie, reserveMeeting, emptyMassageCheck } = require('./service');
const { PORT, COOKIE } = require('./constants');
const { findAllIndexes, timeCheck, getWeekdays, delay, generateHelthReserveURL } = require('./utils');

const app = express();

async function refreshHandler(cookie) {
  const response = await refreshCookie(cookie);
  const now = new Date();
  if (response.data.length > 2000)
    console.log(`
    =======================================
    requestTime: [${now.toLocaleString()}]
    serverTime:  [${response.serverTime.toLocaleString()}]
    cookie:      [${cookie}]
    success refresh cookie
    =======================================
    `);
  else console.log(`[${now.toLocaleString()}] Failed to refresh cookie`);
}

async function reserveEmptyMassage() {
  for (const date of getWeekdays(8)) {
    await delay(3000);
    const resultList = await emptyMassageCheck(date);
    for (const result of resultList) {
      const url = generateHelthReserveURL({ ...result, userId: '2023602' });
      reserveMeeting({ url, cookie: COOKIE });
      console.log(`
        🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
        [${new Date().toLocaleString()}] ${date} ${result.time} empty massage reserved
        🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
        `);
    }
    console.log(`[${new Date().toLocaleString()}] ${date} empty massage check done ${resultList}`);
  }
}

app.listen(PORT, async () => {
  refreshHandler(COOKIE);
  setInterval(() => refreshHandler(COOKIE), 5 * 60 * 1000);

  reserveEmptyMassage();
  setInterval(reserveEmptyMassage, 5 * 60 * 1000);
});

app.get('/', async (req, res) => {
  const response = await refreshCookie();
  const now = new Date();
  if (response.data.length > 2000)
    res.send({
      requestTime: now.toLocaleString(),
      serverTime: response.serverTime.toLocaleString(),
      message: 'success refresh cookie',
    });
  else res.send({ message: 'Failed to refresh cookie' });
});
app.get('/html', async (req, res) => {
  const response = await refreshCookie();
  res.send(response.data);
});

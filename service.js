const { parse } = require('node-html-parser');
const { HOME_URL, COOKIE } = require('./constants');

const refreshCookie = async (cookie) => {
  try {
    const response = await fetch(HOME_URL, {
      method: 'GET',
      headers: {
        Cookie: cookie,
        'User-Agent': 'Mozilla/5.0',
      },
    });
    const serverTime = new Date(response.headers.get('date'));
    return { data: await response.text(), serverTime };
  } catch (error) {
    return;
  }
};

const reserveMeeting = async ({ url, cookie }) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Cookie: cookie,
      'User-Agent': 'Mozilla/5.0',
    },
  });
  const responseJson = await response.json();
  console.log(responseJson);

  if (!responseJson.errorMsg) {
    return 'success';
  } else {
    const serverTime = new Date(response.headers.get('date'));
    const serverMin = serverTime.getMinutes();
    if (serverMin >= 1) return 'timeOver';
    return 'fail';
  }
};

const emptyMassageCheck = async (date) => {
  const baseUrl = `https://talk.tmaxsoft.com/front/health/findHealthList.do?srchMenuNo=TM0041&toggleMenuNo=TM0044&useDate=${date}`;
  const response = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      Cookie: COOKIE,
      'User-Agent': 'Mozilla/5.0',
    },
  });
  const responseHtml = await response.text();
  const htmlDocument = parse(responseHtml);

  const root = htmlDocument.querySelector('.subBoard_reservation');
  const aList = Array.from(root.querySelectorAll('a'));
  const oriFiltered = aList.filter(
    (a) => a.attrs.href.includes('HEL20231220001') || a.attrs.href.includes('HEL20240318001')
  );
  const timeFiltered = oriFiltered.filter((a) => a.attrs.href.split(',').at(-3).replaceAll("'", '') * 1 < 2000);
  const result = timeFiltered.map((a) => {
    const managerCode = a.attrs.href.split(',').at(0).split('inputHealth(')[1].replaceAll("'", '');
    return {
      date,
      time: a.attrs.href.split(',').at(-3).replaceAll("'", '').replaceAll('\t', '').replaceAll('\n', ''),
      managerCode,
    };
  });
  return result;
};
module.exports = { refreshCookie, reserveMeeting, emptyMassageCheck };

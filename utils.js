//
function getMondaysAndFridays() {
  const now = new Date(Date.now());
  const year = now.getFullYear();
  const month = now.getMonth();

  const mondays = [];
  const fridays = [];

  // 이번 달의 첫날과 마지막 날을 구합니다.
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 첫 번째 월요일을 찾습니다.
  let firstMonday = firstDay;
  while (firstMonday.getDay() !== 1) {
    firstMonday.setDate(firstMonday.getDate() + 1);
  }

  // 첫 번째 금요일을 찾습니다.
  let firstFriday = firstDay;
  while (firstFriday.getDay() !== 5) {
    firstFriday.setDate(firstFriday.getDate() + 1);
  }

  // 월요일 리스트를 채웁니다.
  let currentMonday = new Date(firstMonday);
  while (currentMonday <= lastDay) {
    mondays.push(formatDate(currentMonday));
    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  // 금요일 리스트를 채웁니다.
  let currentFriday = new Date(firstFriday);
  while (currentFriday <= lastDay) {
    fridays.push(formatDate(currentFriday));
    currentFriday.setDate(currentFriday.getDate() + 7);
  }

  return [...mondays, ...fridays];
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
const generateHelthReserveURL = ({ date, time, managerCode, userId }) =>
  `https://talk.tmaxsoft.com/front/health/insertHealth.do?helMngerCd=${managerCode}&useDate=${date}&useStTime=${time}00&useEdTime=${time}50&userDiv=0001&reqEmpNo=${userId}`;

function findAllIndexes(arr, val) {
  var indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

function timeCheck() {
  const now = new Date();
  const date = now.getDate();
  const hour = now.getHours();
  const min = now.getMinutes();

  if (date !== 25) return 'notTime';
  if (hour !== 9) return 'notTime';
  if (min > 0) return 'notTime';
  return now.toLocaleString();
}

function getWeekdays(month) {
  // 주어진 달의 첫 날과 마지막 날을 정의합니다.
  const startDate = new Date(2024, month - 1, 1); // 월은 0부터 시작하므로 month-1
  const endDate = new Date(2024, month, 0); // 주어진 달의 마지막 날

  // 현재 날짜를 얻습니다.
  const today = new Date();

  // 모든 평일(월-금)을 저장할 배열
  const weekdays = [];

  // 현재 날짜를 첫날로 설정
  let currentDate = startDate;

  // 첫날부터 마지막 날까지 반복
  while (currentDate <= endDate) {
    // 월요일(1)부터 금요일(5)까지를 체크하여 배열에 추가
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && currentDate >= today) {
      const formattedDate = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(
        currentDate.getDate()
      ).padStart(2, '0')}`;
      weekdays.push(formattedDate);
    }
    // 다음 날짜로 이동
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekdays;
}

function delay(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

module.exports = { getMondaysAndFridays, generateHelthReserveURL, findAllIndexes, timeCheck, getWeekdays, delay };

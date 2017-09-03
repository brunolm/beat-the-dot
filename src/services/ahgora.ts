import * as HTMLParser from 'fast-html-parser';
import * as moment from 'moment';
import * as settingsService from './settings';

import axios from 'axios';

interface TimesFilter {
  month?: string;
  year?: string;
}

const baseURL = 'https://www.ahgora.com.br';
const apiLogin = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

const hourMinuteFormat = 'HH:mm';

let api;

function getText(element, text = '') {
  if (!element.childNodes) {
    return text + element.rawText;
  }

  for (const e of element.childNodes) {
    text = getText(e, text);
  }

  return text;
}

function parseHTML(html: string): Promise<{ summary: string, times: any }> {
  return new Promise((resolve) => {
    const document = HTMLParser.parse(html);

    const tableTotalize = document.querySelector('#tableTotalize') as HTMLTableElement;

    const summary = getText(tableTotalize)
      .replace(/ {2,}/g, ' ')
      .replace(/(\s?\n){2,}/g, '\n').trim();

    const timetable = document.querySelectorAll('#content table')[1];

    const times = {};
    const trs = timetable.querySelectorAll('tbody tr');

    for (const element of trs) {
      if (element.querySelectorAll('td').length <= 3) {
        continue;
      }

      const dateCol = element.querySelector('td');
      const key = getText(dateCol).trim();

      if (key) {
        const beatsRaw = getText(element.querySelectorAll('td')[2]).trim();

        times[key] = {
          beats: beatsRaw.length ? beatsRaw.split(/\s*,\s*/g) : [],
          beatsRaw,
          date: moment(key, 'DD/MM/YYYY'),
          total: getText(element.querySelectorAll('td')[6]).trim(),
        };

        times[key].patch = {
          correct: {
            reason: getText(element.querySelectorAll('td')[5]).trim(),
            time: getText(element.querySelectorAll('td')[3]).trim(),
            type: getText(element.querySelectorAll('td')[4]).trim(),
          },
          wrong: {
            reason: '',
            time: '',
            type: '',
          },
        };
      }
    }

    return resolve({
      summary,
      times,
    });
  });
}

function toRawParams(obj) {
  return Object.keys(obj).map((key) => `${key}=${encodeURIComponent(obj[key])}`).join(`&`);
}

export async function login() {
  const options = await settingsService.get();
  const data = toRawParams({
    empresa: options.company,
    matricula: options.user,
    senha: options.pass,
  });

  const response = await apiLogin.post('/externo/login', data);

  const setCookieHeader = response.headers['set-cookie'];
  const cookie = setCookieHeader ? setCookieHeader[0] : undefined;

  const headers = cookie ? { Cookie: cookie.split(';')[0] } : undefined;
  api = axios.create({
    baseURL,
    headers,
  });

  return cookie;
}

export async function getTimes({ month = moment().format('MM'), year = moment().format('YYYY') }: TimesFilter = {}) {
  if (!api) {
    await login();
  }

  const monthYear = `${month}-${year}`;

  const url = `/externo/batidas/${monthYear}?nocache=true&breaker=${Math.random()}`;
  const response = await api.get(url);

  return await parseHTML(response.data);
}

export function getToday(times) {
  return times[moment().format('DD/MM/YYYY')];
}

export async function parseResult(times) {
  const options = await settingsService.get();

  const today = getToday(times) || { beats: [] };
  const t1 = moment(today.beats[0], hourMinuteFormat);
  const t2 = moment(today.beats[1], hourMinuteFormat);
  const t3 = moment(today.beats[2], hourMinuteFormat);

  switch (today.beats.length) {
    case 1:
      return `You can go to lunch at ${options.lunchAt}`;

    case 2:
      const backFromLunchAt = moment(t2);
      backFromLunchAt.add(options.lunchTime, 'minutes');
      return `You can come back from lunch at ${moment(backFromLunchAt).format(hourMinuteFormat)} (±${options.tolerance})`;

    case 3:
      let section = moment(t2);
      section.add(-t1.hour(), 'hours');
      section.add(-t1.minute(), 'minutes');

      const d = moment(`${options.workHours}00`.slice(-6), 'HHmmss');
      d.add(-section.hour(), 'hours');
      d.add(-section.minute(), 'minutes');

      section = moment(t3);
      section.add(d.hour(), 'hours');
      section.add(d.minute(), 'minutes');

      return `You can leave at ${moment(section).format(hourMinuteFormat)} (±${options.tolerance})`;
    case 4:
      return 'All done for today!';
    default:
      return 'No beats registered today!';
  }
}

export function hoursWorkedToday(beats: string[]) {
  if (!beats || !beats.length) {
    return '00';
  }

  const [t1, t2, t3, t4] = beats.map((b) => moment.duration(`${b}:00`)) as any[];
  switch (beats.length) {
    case 1:
      return '00~';
    case 2:
      return moment.utc(moment.duration(t2 - t1).asMilliseconds()).format('HH:mm');
    case 3:
      return moment.utc(moment.duration(t2 - t1).asMilliseconds()).format('HH:mm~');
    case 4:
      const span1 = moment.duration(t2 - t1) as any;
      const span2 = moment.duration(t4 - t3) as any;
      return moment.utc(moment.duration(span1 + span2).asMilliseconds()).format('HH:mm');
  }
}

export async function parseGrid(times) {
  const keys = Object.keys(times);

  let grid = '';
  for (const key of keys) {
    const time = times[key];

    if (time.beatsRaw) {
      grid += `${key} - ${time.beatsRaw} (${time.total.match(/\d{2}:\d{2}/)})`;
      if (time.patch.wrong.time) {
        grid += ` (${time.patch.wrong.time} -> ${time.patch.correct.time})`;
      }
      grid += '\n';

      const scenarios = await calc(time.beatsRaw.match(/\d{2}:\d{2}/g)) as string[];
      if (scenarios.length) {
        grid += '  ' + scenarios.join('\n  ');
        grid += '\n';
      }
    }
  }

  return grid;
}

async function calc([time1, time2, time3, time4]) {
  const options = await settingsService.get();

  const [t1, t2, t3, t4] = [
    moment(time1, hourMinuteFormat),
    moment(time2, hourMinuteFormat),
    moment(time3, hourMinuteFormat),
    moment(time4, hourMinuteFormat),
  ];

  const scenarios = [];

  const day = moment(options.workHours, hourMinuteFormat);
  const morning = subTime(t2, t1);
  const afternoon = subTime(t4, t3);

  const workedHours = t4.isValid()
    ? moment(morning).add(afternoon.hour() as any, 'hours').add(afternoon.minute() as any, 'minutes')
    : moment(morning);

  if (t4.isValid()) {
    if (workedHours.isAfter(moment(day).add(options.tolerance as any, 'minutes'))) {
      const timeToRemove = subTime(workedHours, day);
      {
        // Scenario 1 - Remove from end of the day
        const newEndTime = subTime(t4, timeToRemove);
        scenarios.push(`${time1} ${time2} ${time3} *${newEndTime.format(hourMinuteFormat)}*`);
      }
    }
    else if (workedHours.isBefore(moment(day).add(-options.tolerance as any, 'minutes'))) {
      const timeToAdd = subTime(day, workedHours);
      {
        // Scenario 1 - Add to the end of the day
        const newEndTime = addTime(t4, timeToAdd);
        scenarios.push(`${time1} ${time2} ${time3} *${newEndTime.format(hourMinuteFormat)}*`);
      }
    }
  }
  else if (t3.isValid()) {
    {
      // Scenario 1 - Predict end of the day
      const newEndTime = addTime(t3, subTime(day, morning));
      scenarios.push(`${time1} ${time2} ${time3} *${newEndTime.format(hourMinuteFormat)}*`);
    }
    {
      // Scenario 2 - Predict beginning of the day
      const section = subTime(t1, subTime(day, subTime(t3, t2)));
      scenarios.push(`*${section.format(hourMinuteFormat)}* ${time1} ${time2} ${time3}`);
    }
  }

  return scenarios;
}

function addTime(target: moment.Moment, date: moment.Moment) {
  return moment(target)
    .add(date.hour() as any, 'hours')
    .add(date.minute() as any, 'minutes');
}

function subTime(target: moment.Moment, date: moment.Moment) {
  return moment(target)
    .add(-date.hour() as any, 'hours')
    .add(-date.minute() as any, 'minutes');
}

export const LogLevel = {
  info: 0,
  warn: 1,
  error: 2
}
interface Log {
  level: number;
  message: string;
  children: Log[];
}

// Assert
let assertRes: boolean[] = [];
export const assert = (a: any, b: any) => {
  assertRes.push(a === b);
}

// Unit test 
export const it = (label:string, test: any) => {
  assertRes = [];
  try {
    test();
  } catch(e) {
    currentLog.children.push({
      level: LogLevel.error, 
      message: `${label} : FAIL\n  > Error thrown during the test : ${e.message}`, 
      children: []
    });
    return;
  }
  let pos = 0;
  let neg = 0;
  let out = assertRes.map(test => {
    if (test) {
      pos++;
      return '-';
    } else {
      neg++;
      return 'F';
    }
  }).join('');

  if (pos === 0 && neg === 0) {
    currentLog.children.push({level: LogLevel.warn, message: `${label} : NO TESTS`, children: []});
  } else if (neg === 0) {
    currentLog.children.push({level: LogLevel.info, message: `${label} : PASS (${pos} asserts)`, children: []});
  } else {
    currentLog.children.push({level: LogLevel.error, message: `${label} : FAIL (${pos}/${pos+neg} asserts) ${out}`, children: []});
  }
}

// Describe
export const describe = (label: string, exec: any) => {
  const parentLog = currentLog;
  currentLog = {
    level: LogLevel.info,
    message: '',
    children: []
  }
  parentLog.children.push(currentLog);

  exec();

  const stats = logStatsDive(currentLog);
  currentLog.children.forEach(val => {
    currentLog.level = Math.max(val.level, currentLog.level);
  });
  currentLog.message = `${label} (${stats[0]}/${stats[1]})`;

  currentLog = parentLog;
}

// State
let masterLog: Log = {
  level: LogLevel.info,
  message: '[SPECS]',
  children: []
}
let currentLog = masterLog;

// Interface
export const print = () => {
  masterLog.level = masterLog.children.reduce((acc, val) => Math.max(acc, val.level), 0);
  printLog(masterLog);
}

// Print
const logPrefix = {
  [LogLevel.info]: '✅',
  [LogLevel.warn]: '🛎️',
  [LogLevel.error]: '❌',
}
const printLog = (logEntry: Log) => {
  const label = `${logPrefix[logEntry.level]} ${logEntry.message}`;
  if (logEntry.level !== LogLevel.info && logEntry.children?.length) {
    console.group(label);
  } else if (logEntry.children?.length) {
    console.groupCollapsed(label);
  } else {
    console.log(label)
  }
  logEntry.children.forEach(printLog);
  if (logEntry.children?.length) {
    console.groupEnd();
  }
}

type logStats = [number, number];
const logStatsDive = (logEntry: Log, stats: logStats = [0,0]) => {
  if (!logEntry.children.length) {
    stats[0] += logEntry.level === LogLevel.info ? 1 : 0;
    stats[1]++;
  } else {
    logEntry.children.reduce((acc, val) => {
      const childStats = logStatsDive(val);
      acc[0] += childStats[0];
      acc[1] += childStats[1];
      return acc;
    }, stats)
  }
  return stats;
}
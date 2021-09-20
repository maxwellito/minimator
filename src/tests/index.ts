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
let itLogs:Log[] = [];
export const it = (label:string, test: any) => {
  assertRes = [];
  try {
    test();
  } catch(e) {
    itLogs.push({
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
    itLogs.push({level: LogLevel.warn, message: `${label} : NO TESTS`, children: []});
  } else if (neg === 0) {
    itLogs.push({level: LogLevel.info, message: `${label} : PASS (${pos} asserts)`, children: []});
  } else {
    itLogs.push({level: LogLevel.error, message: `${label} : FAIL (${pos}/${pos+neg} asserts) ${out}`, children: []});
  }
}

// Describe
export const describe = (label: string, exec: any) => {
  itLogs = [];
  const parentLog = currentLog;
  currentLog = {
    level: LogLevel.info,
    message: '',
    children: []
  }
  parentLog.children.push(currentLog);

  exec();

  const hasFailed = itLogs.filter(val => {
    currentLog.level = Math.max(val.level, currentLog.level);
    return val.level !== LogLevel.info
  }).length;
  currentLog.message = `${label} (${itLogs.length - hasFailed}/${itLogs.length})`;
  itLogs.forEach(i => currentLog.children.push(i))

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
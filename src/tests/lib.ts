type CB = ()=>void;
type SubTest = [label: string, callback: CB, type: number];
const LogLevel = {
  info: 0,
  warn: 1,
  error: 2
}
const logPrefix = {
  [LogLevel.info]: '✅',
  [LogLevel.warn]: '🛎️',
  [LogLevel.error]: '❌',
}

class TestBlock {
  // Info
  level: number = LogLevel.info;
  passTests = 0;
  totalTests = 0;

  // Procedures
  befores: CB[] = [];
  beforeEachs: CB[] = [];
  afters: CB[] = [];
  afterEachs: CB[] = [];

  // Subs
  children: TestBlock[] = [];
  subs: SubTest[] = [];

  constructor(public label: string, public parent?: TestBlock) {}

  run() {
    // Opening by running the before
    this.befores.forEach(cb => cb());

    // List all the 'each' calls before running the tests
    const beforeEachs:CB[] = [...this.beforeEachs];
    const afterEachs:CB[] = [...this.afterEachs];
    let tBlock: TestBlock | undefined = this;
    while(tBlock = tBlock.parent) {
      beforeEachs.splice(0,0, ...tBlock.beforeEachs);
      afterEachs.splice(afterEachs.length,0, ...tBlock.afterEachs);
    }

    this.subs.forEach(s => {
      if(s[2]===0) {
        // Its a IT
        beforeEachs.forEach(b => b());
        this.runIt(s);
        afterEachs.forEach(a => a());
      } else {
        // Its a describe
        const desc = new TestBlock(s[0], this);
        currentDescribe = desc;
        s[1]();
        desc.run();
        this.children.push(desc);
      }
    })

    // Set state
    this.setStats();

    // Closing by running the afters
    this.afters.forEach(cb => cb());
  }
  runIt(sub: SubTest) {
    assertRes = [];
    const label = sub[0];
    const itTB = new TestBlock(label, this);
    itTB.totalTests = 1;
    this.children.push(itTB);
    try {
      sub[1]();
    } catch(e: any) {
      itTB.level = LogLevel.error;
      itTB.label = `${label} : FAIL\n  > Error thrown during the test : ${e.message}`;
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
      itTB.level = LogLevel.warn;
      itTB.label = `${label} : NO TESTS`;
    } else if (neg === 0) {
      itTB.level = LogLevel.info;
      itTB.label = `${label} : PASS (${pos} asserts)`;
      itTB.passTests++;
    } else {
      itTB.level = LogLevel.error;
      itTB.label = `${label} : FAIL (${pos}/${pos+neg} asserts) ${out}`;
    }
  }

  print(){
    const label = `${logPrefix[this.level]} ${this.label}`;
    if (this.level !== LogLevel.info && this.children?.length) {
      console.group(label);
    } else if (this.children?.length) {
      console.groupCollapsed(label);
    } else {
      console.log(label)
    }
    this.children.forEach(c => c.print());
    if (this.children?.length) {
      console.groupEnd();
    }
  }

  setStats() {
    this.children.forEach(c => {
      this.level = Math.max(this.level, c.level);
      this.passTests += c.passTests;
      this.totalTests += c.totalTests;
    });
    this.label = `${this.label} [${this.passTests}/${this.totalTests}]`;
  }
}

// IT test runner
let assertRes: boolean[] = [];
export const assert = (a: any, b: any) => {
  assertRes.push(a === b);
}

let masterDescribe = new TestBlock('Specs');
let currentDescribe = masterDescribe;

// Public API
export const beforeEach = (fn:CB) => currentDescribe.beforeEachs.push(fn);
export const before = (fn:CB) => currentDescribe.befores.push(fn);
export const afterEach = (fn:CB) => currentDescribe.afterEachs.push(fn);
export const after = (fn:CB) => currentDescribe.afters.push(fn);
export const describe = (label: string, fn:CB) => currentDescribe.subs.push([label, fn, 1]);
export const it = (label: string, fn:CB) => currentDescribe.subs.push([label, fn, 0]);

export function mock (valueToReturn?: any): Mock {
  const calls: any[] = [];
  const m = function () {
    calls.push(arguments);
    return valueToReturn;
  }
  m.calls = calls;
  m.andReturn = (newValueToReturn?: any) => valueToReturn = newValueToReturn;
  return m;
}
export interface Mock {
  (): any,
  calls: any[][],
  andReturn: (newValueToReturn?: any) => void
}

const mocks = new Set<() => void>();
export function spyOn(object: {[prop: string]: any}, methodName: string, valueToReturn?: any) {
  const originalValue = object[methodName];
  mocks.add(() => object[methodName] = originalValue);
  const newMock = mock(valueToReturn);
  object[methodName] = newMock;
  return newMock;
}
export function resetAllMocks() {
  mocks.forEach(x => x());
  mocks.clear();
}

export function build () {
  masterDescribe.run();
  masterDescribe.print();
}

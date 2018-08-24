const DEFAULT_TIMING_FN = attempts =>
  [500, 1000, 5000, 10000][attempts] || 10000;

export class Timer {
  constructor(callback, timingFn) {
    this.callback = callback;
    this.timingFn = timingFn || DEFAULT_TIMING_FN;
    this.attempts = 0;
    this.timeout = null;
  }

  reset() {
    this.attempts = 0;
    clearTimeout(this.timeout);
    this.timeout = null;
  }

  isRunning() {
    return this.timeout !== null;
  }

  execute() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.attempts = this.attempts + 1;
      this.callback();
    }, this.timingFn(this.attempts));
  }
}

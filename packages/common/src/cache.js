export class Cache {
  constructor(fn) {
    this.fn = fn;
    this.result = null;
  }

  get() {
    if (this.result === null) {
      this.result = this.fn();
    }
    return this.result;
  }
}

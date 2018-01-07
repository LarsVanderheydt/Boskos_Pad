class Timer {
  constructor(fn, t) {
    this.fn = fn;
    this.t = t;
    this.timerObj = setInterval(this.fn, this.t);
  }

  stop() {
    if (this.timerObj) {
        clearInterval(this.timerObj);
        this.timerObj = null;
    }
    return this;
  }

  start() {
    if (!this.timerObj) {
        this.stop();
        this.timerObj = setInterval(this.fn, this.t);
    }
    return this;
  }

  reset(newT) {
    this.t = newT;
    return this.stop().start();
  }
}

module.exports = Timer;

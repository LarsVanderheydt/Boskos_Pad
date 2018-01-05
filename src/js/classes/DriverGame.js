const five = require('johnny-five');
let push = 0;
let gameTimer = "";
let ledTimer = "";
let btnPushed = false;

class DriverGame {
  constructor(leds, btns, board) {
    this.level = null;
    this.complete = false;
    this.gameStarted = false;

    this.buttons = [{
        button: new five.Button({pin: btns[0], board}),
        led: new five.Led({pin: leds[0], board}),
        id: 0
      }, {
        button: new five.Button({pin: btns[1], board}),
        led: new five.Led({pin: leds[1], board}),
        id: 1
      }];

    this.buttons.forEach(btn => {
      btn.button.on('press', () => {
        this.buttons[push].led.off();
        if (this.gameStarted && this.level !== null) {
          if (!btnPushed) {
            if (btn.id === push ) {
              btnPushed = true;
              this.level --;
              this.getLed();
            } else {
              btnPushed = true;
              this.level ++;
              console.log("test");
            }
          }
        }
      });
    })
  }

  getLed() {
    if (this.level === 0) {
      this.complete = true;
      return;
    }

    if (this.level === null) {
      return;
    }

    if (gameTimer) clearTimeout(gameTimer);
    if (ledTimer) clearTimeout(ledTimer);

    gameTimer = setTimeout(() => {
      push = Math.floor(Math.random() * 2);

      this.buttons[push].led.on();
      btnPushed = false;

      ledTimer = setTimeout(() => {
        if (!this.complete) {
          this.buttons.forEach(btn => btn.led.off());
          this.getLed();
        } else {
          clearTimeout(ledTimer);
        }
      }, 500);
    }, 1000);
  }

  start() {
    this.level = Math.floor(Math.random() * 2) + 6;
    this.getLed();
    this.gameStarted = true;
  }

  reset() {
    console.log('driver reset');
    this.gameStarted = false;
    this.level = null;
    this.buttons.forEach(btn => btn.led.off());
  }
}


module.exports = DriverGame;

const Timer = require('../Timer');
const five = require('johnny-five');

let walkTimer, sequenceTimer, countdownTimer, blinkTimer = '';
const timerLoops = 250;
let blink = true;
let up = true;
let gameStarted = false;
let random, index, push, i = 0;
let leds = [0, 1, 2];
let gameTimer = '';
let complete = false;
let timesFailed = 0;
let r = 255, g = 255, b = 255;

class TrainGame {
  constructor({first, second, third}, board, {joystick, rgb}) {
    this.complete = false;

    this.rgb = new five.Led.RGB({
      pins: {
        red: rgb.r,
        green: rgb.g,
        blue: rgb.b
      }, board: board
    });
    this.joystick = new five.Joystick({pins: [joystick.x, joystick.y], board: board});

    this.buttons = [
      {
        button: new five.Button({pin: first.btn, board: board}),
        led: new five.Led({pin: first.led, board: board}),
        id: 0
      },
      {
        button: new five.Button({pin: second.btn, board: board}),
        led: new five.Led({pin: second.led, board: board}),
        id: 1
      },
      {
        button: new five.Button({pin: third.btn, board: board}),
        led: new five.Led({pin: third.led, board: board}),
        id: 2
      }
    ];

    this.initSequences();

    this.buttons.forEach(btn => {
      // initialize buttons only once to avoid memory leaks
      btn.button.on('press', () => {
        this.level = 0;
        timesFailed = 0;
        if (complete) return;

        if (!gameStarted) {
          gameStarted = true;
          this.preGameAnimation();
        } else {
          if (push === btn.id) {
            this.startGame();
          } else {
            blink = true;
            this.preGameAnimation();
          }
        }
      });
    });
  }

  powerUpReady() {
    this.joystick.on('change', () => {
      if (this.joystick.x >= 0.5) b -= 15;
      if (this.joystick.x <= -0.5) g += 15;
      if (this.joystick.y >= 0.5) b += 15;
      if (this.joystick.y <= -0.5) g -= 15;

      if (r <= 0) r = 0;
      if (g <= 0) g = 0;
      if (b <= 0) b = 0;

      if (r >= 255) r = 255;
      if (g >= 255) g = 255;
      if (b >= 255) b = 255;
    });

    setInterval(() => {
      if (r === 255 && g === 0 && b === 0) {
        this.complete = true;
      }

      this.rgb.color(`rgb(${r}, ${g}, ${b})`);
    });
  }

  // blink for 2 seconds, then give a button to push on
  preGameAnimation() {
    this.reset();

    if (blink) {
      this.playSequence('blink');

      blinkTimer = setTimeout(() => {
        blink = false;
        this.preGameAnimation();
      }, 2000);

    } else {
      this.startGame();
      clearTimeout(blinkTimer);
    }
  }

  // reset all animations and leds
  reset() {
    // stop switching to sequences
    sequenceTimer.stop();
    // stop sequences self if still playing
    walkTimer.stop();
    countdownTimer.stop();
    // turn all leds off (if leds are blinking, stop blinking)
    this.playSequence('reset');
    // reset game for the saboteur
    leds = [0, 1, 2];
    up = true;
    g = 255;
    b = 255;
  }

  initSequences() {
    this.countdownSequence();
    countdownTimer.stop();
    this.walkSequence();
    this.startAnimations();
  }

  startAnimations() {
    // switch between sequence
    let next = true;

    sequenceTimer = new Timer(() => {
      next = !next; // switch to other sequence
      // reset everything when switching sequence
      i = 0;
      up = true;
      this.playSequence('reset')
      //////////////////////////////////

      if (next) {
        this.walkSequence();
        countdownTimer.stop();
      } else {
        this.countdownSequence();
        walkTimer.stop();
      }
    }, 10000);

    sequenceTimer.reset(10000);
  }

  startGame() {
    // leds lets us know what leds are already used and which are still available
    if (leds.length === 0) {
      this.completeGame();
      return;
    }
    if (!gameStarted) return;
    if (gameTimer) clearTimeout(gameTimer);

    if (timesFailed <= 5) { // to avoid endless loops of blink animation
      push = leds[Math.floor(Math.random() * leds.length)]; // take a random led that is still available

      // remove led from array so it can't be used again
      const index = leds.indexOf(push);
      leds.splice(index, 1);

      this.buttons[push].led.on();

      // when to slow, reset game
      gameTimer = setTimeout(() => {
        blink = true;
        this.preGameAnimation();
        timesFailed ++;
      }, 2000);

    } else {
      gameStarted = false;
      complete = false;
      this.initSequences();
    }
  }

  completeGame() {
    clearTimeout(gameTimer);
    gameTimer = 0;

    gameStarted = false;
    complete = true;

    setTimeout(() => {
      this.reset();
      this.powerUpReady();
    }, 3000);
  }

  walkSequence() {
    up = true;
    i = 0;

    walkTimer = new Timer(() => {
      this.playSequence(i);
      if (up === true) {
        if (i < 2) {
          i ++;
        } else {
          i --;
          up = false;
        }
      } else {
        i--;
        if (i === 0) {
          up = true
        };
      }
    }, timerLoops);

    walkTimer.reset(timerLoops);
  }

  countdownSequence() {
    i = 3;

    countdownTimer = new Timer(() => {
      this.playSequence(i)
      if (i < 15) {
        i ++;
      } else {
        i = 3;
      }
    }, timerLoops);

    countdownTimer.reset(timerLoops);
  }

  playSequence(sequence) {
    // all led combinations for sequences (including blink & resetting leds)
    // options
        // numbers 0 - 3 = 1 sequence
        // numbers 3 - 14 = 1 sequence
        // 'reset' = sets all leds to OFF
        // 'blink' = blinks all leds at 300 milliseconds

    switch (sequence) {
      // 1 led ON 2 leds OFF
      case 0:
      this.buttons[0].led.on();
      this.buttons[1].led.off();
      this.buttons[2].led.off();
        break;

      case 1:
      this.buttons[0].led.off();
      this.buttons[1].led.on();
      this.buttons[2].led.off();
        break;

      case 2:
      this.buttons[0].led.off();
      this.buttons[1].led.off();
      this.buttons[2].led.on();
        break;
      /////////////////////////
      // start with all leds on and count down
      // to left
      case 3:   // OOO
      this.buttons[0].led.on();
      this.buttons[1].led.on();
      this.buttons[2].led.on();
        break;

      case 4:   // 00I
      this.buttons[0].led.on();
      this.buttons[1].led.on();
      this.buttons[2].led.off();
        break;

      case 5:   // OII
      this.buttons[0].led.on();
      this.buttons[1].led.off();
      this.buttons[2].led.off();
        break;

      case 6:   // III
      this.buttons[0].led.off();
      this.buttons[1].led.off();
      this.buttons[2].led.off();
        break;

      case 7:   // OII
      this.buttons[0].led.on();
      this.buttons[1].led.off();
      this.buttons[2].led.off();
        break;

      case 8:   // OOI
      this.buttons[0].led.on();
      this.buttons[1].led.on();
      this.buttons[2].led.off();
        break;

      case 9:   // IOO
      this.buttons[0].led.off();
      this.buttons[1].led.on();
      this.buttons[2].led.on();
        break;

      case 10:   // IIO
      this.buttons[0].led.off();
      this.buttons[1].led.off();
      this.buttons[2].led.on();
        break;

      case 11:   // III
      this.buttons[0].led.off();
      this.buttons[1].led.off();
      this.buttons[2].led.off();
        break;

      case 12:   // II0
      this.buttons[0].led.off();
      this.buttons[1].led.off();
      this.buttons[2].led.on();
        break;

      case 13:   // I00
      this.buttons[0].led.off();
      this.buttons[1].led.on();
      this.buttons[2].led.on();
        break;

      case 14:   // 000
      this.buttons[0].led.on();
      this.buttons[1].led.on();
      this.buttons[2].led.on();
        break;
      ////////////////////////

      case 'reset':
      this.buttons[0].led.off();
      this.buttons[1].led.off();
      this.buttons[2].led.off();

      this.buttons[0].led.stop();
      this.buttons[1].led.stop();
      this.buttons[2].led.stop();
        break;

      case 'blink':
      this.buttons[0].led.blink(300);
      this.buttons[1].led.blink(300);
      this.buttons[2].led.blink(300);
        break;
    }
  }
}

module.exports = TrainGame;

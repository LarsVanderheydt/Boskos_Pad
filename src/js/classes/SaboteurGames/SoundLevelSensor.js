const five = require('johnny-five');

class SoundLevelSensor {
  constructor(board, pin) {
    const sensor = new five.Sensor({pin: pin, board: board});
    this.level = 1;

    new five.Led(13).on();

    sensor.on("change", () => {
      const constr = sensor.scaleTo(0, 100);
      // if (this.level <= 0) this.level = 1;
      if (constr >= 10) this.level -= 0.01;
    });
  }
}

module.exports = SoundLevelSensor;

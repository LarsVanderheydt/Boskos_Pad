const five = require('johnny-five');

class SoundLevelSensor {
  constructor(pin) {
    const sensor = new five.Sensor(pin);
    this.level = 1;

    sensor.on("change", () => {
      const constr = sensor.scaleTo(0, 100);

      // if (this.level <= 0) this.level = 1;
      if (constr >= 10) this.level -= 0.01;
    });
  }
}

module.exports = SoundLevelSensor;

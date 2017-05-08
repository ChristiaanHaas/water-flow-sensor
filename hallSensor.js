/**
 * Hall sensor
 *
 */

const config     = require('./config')
  , sensors      = config.sensors
  , defaultPin   = config.defaultPin
  , debug        = require('debug')('wfs:HallSensor')
  , GPIO         = require('onoff').Gpio

module.exports = class HallSensor {

  constructor(pin = defaultPin, callback) {

    // Characteristics
    this._pin           = pin
    this._sensor        = new GPIO(pin, 'in', 'rising')

    // Watch ticks
    this._sensor.watch(this.tick.bind(this))

    debug(`Hall sensor on pin ${this._pin} initialized`)
  }

  get pin() {
    return this._pin
  }

  tick(err, state) {
    debug(`tick`)
  }
}

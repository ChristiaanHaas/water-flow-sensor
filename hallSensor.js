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

    // Callback
    this._callback      = callback

    debug(`Hall sensor on pin ${this._pin} initialized`)
  }

  get pin() {
    return this._pin
  }

  get callback() {
    return this._callback
  }

  tick(err, state) {
    debug(`tick`)
    this.callback()
  }
}

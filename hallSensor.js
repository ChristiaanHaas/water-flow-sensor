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

  constructor(pin = defaultPin) {

    // Init sensor
    this._i             = 0

    // Sensor characteristics
    this._pin           = pin
    this._sensor        = new GPIO(pin, 'in', 'rising')

    // Watch ticks to increment counter
    this._sensor.watch(this.increment.bind(this))

    debug(`Hall sensor on pin ${this._pin} initialized`)
  }

  get count() {
    return this._i
  }

  increment(err, state) {
    this._i++

    debug(`Hall sensor on pin ${this._pin} count ${this._i}`)
  }
}

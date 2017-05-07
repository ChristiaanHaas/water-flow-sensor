/**
* water-flow
*
*/

const config     = require('./config')
  , sensors      = config.sensors
  , defaultPin   = config.defaultPin
  , defaultModel = config.defaultModel
  , defaultDelay = config.defaultDelay
  , debug        = require('debug')('wfs:main')
  , GPIO         = require('onoff').Gpio

module.exports = class WaterFlow {

  constructor(pin = defaultPin, model = defaultModel, init = 0, delay = defaultDelay, callback) {

    // Initialize sensor
    this._i             = init
    this._prev          = 0
    this._model         = model
    this._pin           = pin
    this._sensor        = new GPIO(this._pin, 'in', 'rising')

    // Sensor characteristics
    this._countToFlow   = sensors[this._model].countToFlow
    this._countToVolume = sensors[this._model].countToVolume

    // Delay
    this._delay         = delay

    // Callback
    this._callback      = callback

    this._interval      = null

    // Watch events
    this._sensor.watch(this.count.bind(this))
    this._sensor.watch(this.computeFlow.bind(this))

    debug(`Sensor ${this._model} on pin ${this._pin} (init ${this._i} and delay ${this._delay} ms)`)
  }

  get delay() {
    return this._delay
  }
  set delay(delay) {
    this._delay = delay
    debug(`Sensor ${this._model} on pin ${this._pin} - delay ${this._delay} ms`)
  }

  tick() {
    if (this._prev == this._i) {
      // Flow stopped
      let volume = (this._i * this._countToVolume).toFixed(6)
      debug(`flow stopped with count ${this._i} and volume ${volume} L`)
      clearInterval(this._interval)
    } else {
      this._prev = this._i
    }
  }

  count(err, state) {
    this._i++
  }

  computeFlow(err, state) {

    // Unwatch event
    this._sensor.unwatch()
    this._sensor.watch(this.count.bind(this))

    // Get previous counter
    let hrstart  = process.hrtime()
    let prev     = this._i

    if (this._interval == null) {
      this._interval = setInterval(this.tick.bind(this), 1000)
    }

    // Wait
    /*setTimeout(() => {

      // Renew watch event
      this._sensor.watch(this.computeFlow.bind(this))

      // Current volume and flow
      let hrend  = process.hrtime(hrstart)
      let time   = (hrend[0] + hrend[1] / 1e9).toFixed(6)
      let count  = this._i - prev
      let flow   = (count * this._countToFlow / time).toFixed(6)
      let volume = (count * this._countToVolume).toFixed(6)

      // Callback
      this._callback({
        'pin'   : this._pin,
        'model' : this._model,
        'flow'  : flow,
        'volume': volume,
        'pulses': count
      })

      debug(`${this._pin} | ${this._model} | ${flow} | ${volume} | ${count} | ${time} s`)

    }, this._delay)*/

  }
}

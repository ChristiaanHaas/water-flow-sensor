/**
* water-flow
*
*/

const config     = require('./config')
  , sensors      = config.sensors
  , defaultPin   = config.defaultPin
  , defaultModel = config.defaultModel
  , debug        = require('debug')('wfs:main')
  , GPIO         = require('onoff').Gpio

module.exports = class WaterFlow {

  constructor(pin = defaultPin, model = defaultModel, callback) {

    // Init sensor
    this._i             = 0
    this._prev          = 0
    this._interval      = false
    this._isRunning     = false
    this._hrstart       = 0
    this._hrend         = 0
    this._lasthrend     = 0

    // Characteristics
    this._model         = model
    this._pin           = pin
    this._sensor        = new GPIO(this._pin, 'in', 'rising')
    this._countToFlow   = sensors[this._model].countToFlow
    this._countToVolume = sensors[this._model].countToVolume
    this._factor        = sensors[this._model].factor

    // Metrics
    this._flow          = 0
    this._volume        = 0

    // Callback
    this._callback      = callback

    // Watch events
    this._sensor.watch(this.start.bind(this))

    debug(`Sensor ${this._model} on pin ${this._pin}`)
  }

  get flow() {
    return this._flow
  }
  get volume() {
    return this._volume
  }
  get isRunning() {
    return this._isRunning
  }

  setVolume(i) {
    // V = F / factor * t / 60
    // (L) (Hz)         (s)
    // V = i / (factor * 60)
    // (L)
    this._volume = i / (this._factor * 60)
  }

  start() {
    debug(`Start`)

    // Increment counter
    this._i = 1
    this._prev  = this._i

    // Get start time
    this._hrstart = process.hrtime()
    this._hrend = process.hrtime()
    this._lasthrend = process.hrtime()

    // Watch for next ticks
    this._sensor.unwatch()
    this._sensor.watch(this.tick.bind(this))

    // Set the sensor status
    this._isRunning = true

    // Set interval watcher
    this._interval = setInterval(this.watcher.bind(this), 500)

    // Callback
    this._callback({
      'pin'      : this._pin,
      'model'    : this._model,
      'isRunning': this._isRunning,
      'flow'     : this._flow,
      'volume'   : this._volume
    })

  }

  tick() {
    //debug(`Tick`)

    // Increment counter
    this._i++

    // Get time
    this._hrend = process.hrtime(this._hrstart)
  }

  watcher() {
    //debug(`Watcher`)

    // Get current counter
    let i = this._i
    let hrend = this._hrend

    // Is the sensor running ?
    if (this._prev === i) {
      // Sensor is not running

      // Set the sensor status
      this._isRunning = false

      // Clear interval watcher
      clearInterval(this._interval)

      // Set the first tick watcher
      this._sensor.unwatch()
      this._sensor.watch(this.start.bind(this))

      // Compute volume
      this.setVolume(i)

      // Compute global flow rate
      let delay  = (hrend[0] + hrend[1] / 1e9)
      // Q (L/min) = F (Hz) / factor
      // F (Hz) = count / delay (s)
      this._flow = (i / delay / this._factor)

      // Callback
      this._callback({
        'pin'      : this._pin,
        'model'    : this._model,
        'isRunning': this._isRunning,
        'flow'     : this._flow,
        'volume'   : this._volume
      })

      debug(`Flow stopped (${this._volume} L - flow rate ${this._flow} L/m)`)

    } else {
      // Sensor is running

      // Compute volume
      this.setVolume(i)

      // Compute current flow
      let delay  = (hrend[0] + hrend[1] / 1e9) - (this._lasthrend[0] + this._lasthrend[1] / 1e9)
      debug(`${hrend[0] + hrend[1] / 1e9}`)
      debug(`${this._lasthrend[0] + this._lasthrend[1] / 1e9}`)
      let count  = i - this._prev
      // Q (L/min) = F (Hz) / factor
      // F (Hz) = count / delay (s)
      this._flow = count / delay / this._factor
      //this.setFlow(count, delay)

      // Set the current counter as previous
      this._prev = i
      this._lasthrend = hrend

      debug(`Flow detected (${this._flow} L/min)`)
    }

  }

  callback() {
    this._callback({
      'pin'      : this._pin,
      'model'    : this._model,
      'isRunning': this._isRunning,
      'flow'     : this._flow,
      'volume'   : this._volume
    })
  }

}

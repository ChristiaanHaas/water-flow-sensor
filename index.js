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

  start() {
    debug(`start`)

    // Watch for next ticks
    this._sensor.unwatch()
    this._sensor.watch(this.tick.bind(this))

    // Increment counter
    this._i++

    // Get start time
    this._hrstart = process.hrtime()

    // Set the sensor status
    this._isRunning = true

    // Set interval watcher
    //this._interval = setInterval(this.watcher.bind(this), 1000)
    this.watcher().bind(this)

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
    debug(`Tick`)

    // Increment counter
    this._i++

    // Get time
    this._hrend = process.hrtime(this._hrstart)
  }

  watcher() {
    debug(`Watcher ${this.isRunning}`)

    while (this.isRunning) {

      // Get current count and time
      let prev    = this._i
      let hrstart = this._hrend

      setTimeout(() => {

        // Get new count and time
        let i      = this._i
        let hrend  = this._hrend

        // Is the sensor running ?
        if (prev === i) {
          // Sensor is not running

          // Set the sensor status
          this._isRunning = false

          // Set the first tick watcher
          this._sensor.unwatch()
          this._sensor.watch(this.start.bind(this))

          // Callback
          this._callback({
            'pin'      : this._pin,
            'model'    : this._model,
            'isRunning': this._isRunning,
            'flow'     : this._flow,
            'volume'   : this._volume
          })

          debug(`Flow stopped (${this._volume} L)`)

        } else {
          // Sensor is running

          // Set the current counter as previous
          //this._prev = this._i

          // Compute volume
          this._volume = (i * this._countToVolume).toFixed(6)

          // Compute current flow
          let time   = (hrend[0] + hrend[1] / 1e9).toFixed(6)
          let count  = i - prev
          this._flow = (count * this._countToFlow / time).toFixed(6)

          debug(`Flow detected (${this._flow} L/min)`)
        }

      }, 1000)

    }
    debug(`End of while`)
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

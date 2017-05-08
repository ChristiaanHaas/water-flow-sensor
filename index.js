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

  constructor(pin = defaultPin, model = defaultModel, callback) {

    // Initialize sensor
    this._i             = 0
    this._prev          = 0
    this._interval      = false
    this._isRunning     = false
    this._hrstart       = 0

    // Sensor characteristics
    this._model         = model
    this._pin           = pin
    this._sensor        = new GPIO(this._pin, 'in', 'rising')
    this._countToFlow   = sensors[this._model].countToFlow
    this._countToVolume = sensors[this._model].countToVolume
    this._factor        = sensors[this._model].factor

    // Sensor metrics
    this._flow          = 0
    this._volume        = 0

    // Callback
    this._callback      = callback

    // Watch events
    this._sensor.watch(this.count.bind(this))
    this._sensor.watch(this.runTick.bind(this))

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

  runTick() {
    debug(`flow detected`)

    // Unwatch sensor events
    this._sensor.unwatch(this.runTick.bind(this))
    //this._sensor.watch(this.count.bind(this))

    // First tick
    this._hrstart = process.hrtime()

    // Set interval
    //if (this._interval === false) {
      this._interval = setInterval(this.tick.bind(this), 1000)
    //}

    // Set the sensor status
    this._isRunning = true

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

    /*if (this._prev === this._i) {
      // Flow stopped
      debug(`Flow stopped with count ${this._i}`)

      // Compute flow and volume
      this._flow = (this._i * this._countToFlow / delay).toFixed(6)
      this._volume = (count * this._countToVolume).toFixed(6)

      this._isRunning = false

      clearInterval(this._interval)
      this._interval = false
      this._sensor.watch(this.runTick.bind(this))
      this._i = 0

      // Callback
      this._callback({
        'pin'      : this._pin,
        'model'    : this._model,
        'isRunning': this._isRunning,
        'flow'     : this._flow,
        'volume'   : this._volume
      })

    } else {
      // Flow detected
      debug(`Flow detected (count ${this._i})`)

      // Get count and delay
      let i      = this._i
      let hrend  = process.hrtime(this._hrstart)
      //this._hrstart = process.hrtime()
      let delay  = hrend[0] + hrend[1] / 1e9

      // Update volume and flow metrics
      let count  = i - this._prev
      this._flow = (count * this._countToFlow / delay).toFixed(6)
      this._volume = (count * this._countToVolume).toFixed(6)

    }

    let hrend  = process.hrtime(this._hrstart)
    let time   = (hrend[0] + hrend[1] / 1e9).toFixed(6)

    let flow   = (count * this._countToFlow / time).toFixed(6)
    let volume = (this._i * this._countToVolume).toFixed(6)

    if (this._prev === this._i) {
      // Flow stopped
      debug(`flow stopped with count ${this._i} and volume ${volume} L`)

      clearInterval(this._interval)
      this._interval = false
      this._sensor.watch(this.runTick.bind(this))
      this._i = 0

      // Callback
      this._callback({
        'pin'   : this._pin,
        'model' : this._model,
        'flow'  : flow,
        'volume': volume,
        'pulses': this._i
      })

    } else {
      this._hrstart = process.hrtime()
      this._prev = this._i
    }*/
  }

  count(err, state) {
    this._i++
  }

  computeFlow(err, state) {

    /*if (this._interval === false) {
      this._interval = setInterval(this.tick.bind(this), 1000)
    }

    // Unwatch event
    this._sensor.unwatch()
    this._sensor.watch(this.count.bind(this))

    // Get previous counter
    let hrstart  = process.hrtime()
    let prev     = this._i

    // Wait
    setTimeout(() => {

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

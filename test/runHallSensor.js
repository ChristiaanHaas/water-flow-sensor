var debug        = require('debug')('wfs:runHallSensor')
  , hall         = require('../hallSensor')
  , sensor       = new hall(17, counter)
  , i            = 0

function counter() {
  i++
  debug(`Hall sensor ${sensor.pin} count ${i}`)
}

var debug        = require('debug')('wfs:runHallSensor')
  , hall         = require('../hallSensor')
  , sensor       = new hall(17)
  , i            = 0

function logger() {
  i++
  debug(`Hall sensor ${sensor.pin} count ${i}`)
}

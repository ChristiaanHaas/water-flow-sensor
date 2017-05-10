var wfs     = require('../index')
  , sensor  = new wfs(17, 'POW110D3B', logger)
  , s2      = new wfs(27, 'YF-S201C', logger)
  , total   = 0

//sensor.delay = 1000
/*console.info(
  "Time                     | Flow       | Volume  | Pulses")*/

function logger(res) {
  console.info(res)
}

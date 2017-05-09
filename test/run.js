var wfs     = require('../index')
  //, sensor  = new wfs(17, 'POW110D3B', logger)
  , sensor  = new wfs(27, 'YF-S201C', logger)
  , total   = 0

//sensor.delay = 1000
/*console.info(
  "Time                     | Flow       | Volume  | Pulses")*/

function logger(res) {
  /*let now = new Date().toISOString()
  console.info(`${now} | ${res.flow} L/m | ${res.volume} L | ${res.pulses}`)*/
}

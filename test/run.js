var wfs     = require('../index')
  , sensor  = new wfs(17, 'POW110D3B', logger)
  , sensor2 = new wfs(27, 'YF-S201C', logger)

function logger(res) {
  console.info(res)
}

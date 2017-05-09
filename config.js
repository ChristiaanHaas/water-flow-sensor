/* Sensors */

const config = {}

config.sensors = []

config.sensors['POW110D3B'] = {}
// F (Hz) = 7.5 * Q (L/min)
config.sensors['POW110D3B'].factor  = 7.51766

config.sensors['YF-S201'] = config.sensors['POW110D3B']

config.sensors['YF-S201C'] = {}
// F (Hz) = 5 * Q (L/min)
config.sensors['YF-S201C'].factor   = 6.29

/* Default pin and model */

config.defaultPin   = 17
config.defaultModel = 'POW110D3B'
config.defaultDelay = 1000

/* Exports */

module.exports = config

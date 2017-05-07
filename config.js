/* Sensors */

const config = {}

config.sensors = []

config.sensors['POW110D3B'] = {}
config.sensors['POW110D3B'].countToFlow   = 1 / 7.5 // Pulse frequency (Hz) in Horizontal Test= 7.5Q, Q is flow rate in L/min. (Results in +/- 3% range)
config.sensors['POW110D3B'].countToVolume = 0.002217 //

config.sensors['YF-S201'] = config.sensors['POW110D3B']

config.sensors['YF-S201C'] = {}
// Q (L/m) = F (Hz) / 5 (± 3%)
config.sensors['YF-S201C'].countToFlow    = 1 / 6.29
// TODO Q (L/min) / 60
config.sensors['YF-S201C'].countToVolume  = 0,0026497

/* Default pin and model */

config.defaultPin   = 17
config.defaultModel = 'POW110D3B'
config.defaultDelay = 1000


/* Exports */

module.exports = config

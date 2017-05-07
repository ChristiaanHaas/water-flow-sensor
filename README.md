# Water flow sensor

**Get flow rate and volume consumption from water flow sensors**


## Features

- [x] :electric_plug: Initialize sensor on GPIO pin
- [x] :articulated_lorry: Set the sensor model
- [x] :droplet: Get flow rate (L/m)
- [x] :baby_bottle: Get volume consumption (L)


## Install

```shell
$ cd <project-folder>
$ npm install water-flow-sensor --save
```


## Usage

1. Require `water-flow-sensor` module
2. Initialize sensor with `pin` and `model` values and a callback
3. The callback gives
    * `res.pin`: sensor pin
    * `res.model`: sensor model
    * `res.flow`: instant flow rate in L/min
    * `res.volume`: volume in L
    * `res.pulses`: Number of pulses

```js
var wfs     = require('water-flow-sensor')
  , sensor  = new wfs(17, 'POW110D3B', wfsCb)

function wfsCb(res) {
  console.info(`${res.pin} | ${res.model} | ${res.flow} L/m | ${res.volume} L | ${res.pulses}`)
}
```


## Contributing
Please read the [Code of Conduct]().


## Technical details

### Water flow sensor models

* [POW110D3B](http://wiki.seeedstudio.com/wiki/G1/2_Water_Flow_sensor)
* [YF-S201](http://www.hobbytronics.co.uk/yf-s201-water-flow-meter) - [datasheet](http://www.hobbytronics.co.uk/datasheets/sensors/YF-S201.pdf)
* [YF-S201C](http://digitalmeans.co.uk/shop/g0.5_water_flow_sensor_enclosure)

### Platforms

Developed on Rapsberry Pi model B


### Dependencies

* `onoff ^1.1.2`

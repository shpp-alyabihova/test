const _ = require('lodash');
const Weather = require('../db/models/weather');
const config = require('config');

const sourceData = require('../assets/weatherData');
const windDirection = config.get('weather.windDirection');

module.exports.init = async () => {
    return Weather.bulkCreate(sourceData).catch(err => console.error(err));
};

module.exports.getStateWithMinTemperature = async (direction = windDirection) => {
    return Weather.findStateWithMinTemperatureByWindDirection(windDirection)
        .then(data => _.head(data) ? _.head(data).get('state') : 'data not meeting your query')
        .catch(error => console.error(error));
};
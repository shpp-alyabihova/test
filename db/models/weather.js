const _ = require('lodash');
const DataTypes = require('sequelize');
const Model = require('../sequelize');


const PUBLIC_FIELDS = ['day', 'time', 'state', 'airport', 'temperature', 'humidity', 'windSpeed', 'windDirection', 'station_pressure', 'seeLevelPressure', 'pressure'];


module.exports = Model.define('weather', {
    day: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: DataTypes.INTEGER,
    state: DataTypes.STRING,
    airport: DataTypes.STRING,
    temperature: DataTypes.INTEGER,
    humidity: DataTypes.INTEGER,
    windSpeed: {
        type: DataTypes.INTEGER,
        field: 'wind_speed'
    },
    windDirection: {
        type: DataTypes.INTEGER,
        field: 'wind_direction'
    },
    stationPressure: {
        type: DataTypes.DOUBLE,
        field: 'station_pressure'
    },
    seeLevelPressure: {
        type: DataTypes.DOUBLE,
        field: 'see_level_pressure'
    },
    pressure: {
        type: DataTypes.DOUBLE,
        field: 'see_level_pressure',
        allowNull: true
    }
}, {
    classMethods: {
        findStateWithMinTemperatureByWindDirection(direction) {
            const { min, max } = direction;
            return this.findAll({
                where: {
                    windDirection: {
                        $and: {
                            $gte: min || 0,
                            $lte: max || min,
                            $ne: null
                        }
                    }
                },
                order: [
                    [ 'temperature', 'ASC' ]
                ],
                limit: 1,
                attributes: [ 'state' ]
            });
        }
    },
    instanceMethods: {
        publish(field) {
            return (_.pick(this, field || PUBLIC_FIELDS));
        }
    }
});

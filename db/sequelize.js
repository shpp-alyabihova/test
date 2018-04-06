const _ = require('lodash');
const config = require('config');
const Sequelize = require('sequelize');

const DATABASE_URI = config.get('db.sequelize.uri');
const OPTIONS = config.get('db.sequelize.options');

module.exports = new Sequelize(DATABASE_URI, _.merge({}, OPTIONS));

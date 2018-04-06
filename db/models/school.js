const _ = require('lodash');
const DataTypes = require('sequelize');
const Model = require('../sequelize');


const PUBLIC_FIELDS = ['_id', 'name', 'scores'];

module.exports = Model.define('school', {
  _id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: DataTypes.STRING,
  scores: DataTypes.ARRAY(DataTypes.JSONB)
}, {
  instanceMethods: {
    publish() {
      return _.pick(this, PUBLIC_FIELDS);
    }
  }
});

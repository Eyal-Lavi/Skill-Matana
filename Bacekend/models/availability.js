const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Availability = sequelize.define(
  'Availability',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_time',
    },
    isBooked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_booked',
    },
  },
  {
    tableName: 'availabilities',
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['start_time'] },
      { fields: ['end_time'] },
    ],
  }
);

module.exports = Availability;


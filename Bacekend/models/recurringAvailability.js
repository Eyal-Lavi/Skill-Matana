const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const RecurringAvailability = sequelize.define(
  'RecurringAvailability',
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
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '0 = Sunday, 1 = Monday, ..., 6 = Saturday',
      field: 'day_of_week',
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'end_time',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'recurring_availabilities',
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['day_of_week'] },
      { fields: ['is_active'] },
    ],
  }
);

module.exports = RecurringAvailability;


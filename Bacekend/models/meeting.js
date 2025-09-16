const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Meeting = sequelize.define(
  'Meeting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'host_id',
    },
    guestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'guest_id',
    },
    availabilityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'availability_id',
    },
    roomId: {
      type: DataTypes.STRING(128),
      allowNull: false,
      field: 'room_id',
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
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'canceled'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'reminder_sent',
    },
  },
  {
    tableName: 'meetings',
    timestamps: true,
    indexes: [
      { fields: ['host_id'] },
      { fields: ['guest_id'] },
      { fields: ['start_time'] },
      { fields: ['status'] },
    ],
  }
);

module.exports = Meeting;


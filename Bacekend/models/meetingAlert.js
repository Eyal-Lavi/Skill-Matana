const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const MeetingAlert = sequelize.define(
  'MeetingAlert',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    watcherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'watcher_id',
    },
    targetUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'target_user_id',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'meeting_alerts',
    timestamps: true,
    indexes: [
      { fields: ['watcher_id'] },
      { fields: ['target_user_id'] },
      { unique: true, name: 'uniq_watch_target', fields: ['watcher_id', 'target_user_id'] },
    ],
  }
);

module.exports = MeetingAlert;


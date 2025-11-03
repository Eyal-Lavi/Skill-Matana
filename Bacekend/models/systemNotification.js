const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const SystemNotification = sequelize.define(
  'SystemNotification',
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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_read',
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'system_notifications',
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['is_read'] },
      { fields: ['type'] },
    ],
  }
);

module.exports = SystemNotification;


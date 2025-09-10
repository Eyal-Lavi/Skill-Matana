const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

const Connection = sequelize.define(
  "Connection",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_a",
    },
    userB: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_b",
    },
  },
  {
    tableName: "connections",
    timestamps: true,
    indexes: [
      { fields: ["user_a"] },
      { fields: ["user_b"] },
      {
        unique: true,
        name: "uniq_connection_pair",
        fields: ["user_a", "user_b"],
      },
    ],
  }
);

module.exports = Connection;

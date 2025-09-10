const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

const ContactRequest = sequelize.define(
  "ContactRequest",
  {
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT("medium"),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "requested_by",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    requestedTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "requested_to",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
    tableName: "contact_requests",
  }
);

module.exports = ContactRequest;

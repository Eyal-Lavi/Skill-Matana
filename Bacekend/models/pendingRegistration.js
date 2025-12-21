const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');
const bcrypt = require('bcrypt');

const PendingRegistration = sequelize.define('PendingRegistration', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verificationCode: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'pending_registrations',
    timestamps: true,
    hooks: {
        beforeCreate: async (registration) => {
            if (registration.password) {
                registration.password = await bcrypt.hash(registration.password, 12);
            }
        }
    }
});

module.exports = PendingRegistration;


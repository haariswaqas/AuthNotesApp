const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notNull: { msg: 'Email address is required' },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Password is required' },
                len: [6, 100],
            },
        },
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
        },
    }
);

// Instance method to validate password
User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Define associations
User.associate = (models) => {
    User.hasMany(models.Note, {
        foreignKey: 'userId',
        as: 'notes',
    });
};

module.exports = User;

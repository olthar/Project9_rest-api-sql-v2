'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    firstName:{ 
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a "firstName" with your POST request',
          },
          notEmpty: {
            msg: 'Please provide a "firstName" with your POST request',
          },
        },
    },
    lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'Please provide a "lastName" with your POST request',
              },
              notEmpty: {
                msg: 'Please provide a "lastName" with your POST request',
              },
            },
    },
    emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'Please provide a valid "emailAddress" with your POST request',
              },
              notEmpty: {
                msg: 'Please provide a valid "emailAddress" with your POST request',
              },
              //Check the email format is valid. 
              isEmail: {
                msg: 'Please check the format of email address'
              }
            },
    },
    password: Sequelize.STRING,
    
    
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'owner',
      foreignKey: {
        fieldName: 'userId',
        field: 'userId',
        allowNull: false,
      },
    });
    };

   

  return User;
};
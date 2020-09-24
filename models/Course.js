'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    title:{ 
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a value for "title"',
          },
          notEmpty: {
            msg: 'Please provide a value for "title"',
          },
        },
    },
    description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'Please provide a "description"',
              },
              notEmpty: {
                msg: 'Please provide a "description"',
              },
            },
    },
    estimatedTime: Sequelize.STRING,
    materialsNeeded: Sequelize.STRING
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'owner',
      foreignKey: {
        fieldName: 'userId',
        field: 'userId',
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please provide a userId for the "course"',
          },
          notEmpty: {
            msg: 'Please provide a userId for the "course"',
          },
      },
    }});
  };



  return Course;
};
'use strict'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Model} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
    }
  };
  user.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please add you name'
        }
      }
    },
    password_digest: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please provide a password'
        },
        len: {
          args: [6, 30],
          msg: 'Your password must be between 6 and 30 characters'
        }
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please add an email'
        },
        isEmail: {
          args: true,
          msg: 'Please add an valid email'
        }
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      }
    }

  }, {
    timestamps: true,
    underscored: true,
    sequelize,
    modelName: 'user'
  })
  user.beforeSave(async function (user, next) {
    console.log(user._changed)
    // if (!this.isModified("password")) {
    //   next();
    // }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  })

  user.getSignedJwtToken = function (id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    })
  }

  user.matchpasswords = async function (enteredPassword, user) {
    return await bcrypt.compare(enteredPassword, user.password)
  }
  return user
}

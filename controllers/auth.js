const ErrorHandler = require('../utils/errorHandler.js')
const models = require('../models')

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const userData = await models.user.create({
      name,
      email,
      password
    })
    const token = models.user.getSignedJwtToken(userData.id)

    res.status(200).json({
      sucess: true,
      token
    })
  } catch (error) {
    next(error)
  }
}

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // validate email and password
    if (!email || !password) {
      return next(new ErrorHandler('Please provide email password', 400))
    }

    // check for user
    const userData = await models.user
      .findOne({ where: { email: email } })

    if (!userData) {
      return next(new ErrorHandler('Invalid credentials', 400))
    }

    // check password
    const isMatch = await models.user.matchpasswords(password, userData)
    if (!isMatch) {
      return next(new ErrorHandler('Invalid credentials', 400))
    }

    const token = models.user.getSignedJwtToken(userData.id)

    res.status(200).json({
      sucess: true,
      token
    })
  } catch (error) {
    next(error)
  }
}

exports.getMe = async (req, res, next) => {
  try {
    const user = await models.user.findByPk(req.user.id)
    res.status(200).json({
      sucess: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}
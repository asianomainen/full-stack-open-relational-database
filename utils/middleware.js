const jwt = require('jsonwebtoken');

const { Blog, User } = require('../models');
const { SECRET } = require('./config');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const userFinder = async (req, res, next) => {
  req.blog = await User.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'TypeError') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  blogFinder,
  userFinder,
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
}

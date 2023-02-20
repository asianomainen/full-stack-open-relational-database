const router = require('express').Router()

const { Blog, User } = require('../models')
const { userFinder, tokenExtractor } = require('../utils/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', userFinder, async (req, res) => {
  if (req.user) {
    res.json(req.user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  user.set({
    username: req.params.username
  })
  await user.save()

  res.json(user)
})

module.exports = router

const router = require('express').Router()
const { Op } = require('sequelize');

const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor } = require('../utils/middleware')
const { sequelize } = require('../utils/db');

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search
          }
        },
        {
          author: {
            [Op.substring]: req.query.search
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: sequelize.literal('likes DESC')
  })

  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(400).end()
  }
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
  return res.json(blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (user.id === req.blog.userId) {
    await req.blog.destroy()
    res.status(200).end()
  } else {
    res.status(401).end()
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router

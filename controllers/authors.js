const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../utils/db');

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    order: sequelize.literal('likes DESC')
  })

  res.json(authors)
})

module.exports = router

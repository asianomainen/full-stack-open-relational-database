const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)
Blog.sync({ alter: true }).then()
User.sync({ alter: true }).then()

module.exports = {
  Blog, User
}

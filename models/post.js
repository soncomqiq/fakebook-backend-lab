module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    message: {
      type: DataTypes.STRING(500)
    },
    image_url: {
      type: DataTypes.STRING(500)
    }
  })

  post.associate = (models) => {
    post.hasMany(models.comment, { onDelete: 'CASCADE', foreignKey: 'post_id' })
  }
  return post
}
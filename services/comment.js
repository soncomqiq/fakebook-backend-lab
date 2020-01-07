const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post('/create-comment/:post_id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.comment.create({
        message: req.body.message,
        post_id: req.params.post_id,
        user_id: req.user.id
      })
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    })

  app.put('/update-comment/:comment_id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 2
      let targetComment = await db.comment.findOne({
        where: { id: req.params.comment_id }
      })
      if (!targetComment) {
        res.status(404).send({ message: "comment not founded" })
      } else if (targetComment.user_id !== req.user.id) {
        res.status(401).send({ message: "Unauthorized" })
      } else {
        targetComment.update({
          message: req.body.message
        })
        res.send({ message: `Comment id: ${req.params.comment_id} has been edited.` })
      }
    })

  app.delete('/delete-comment/:comment_id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 3
      let targetComment = await db.comment.findOne({
        where: { id: req.params.comment_id }
      })
      if (!targetComment) {
        res.status(404).send({ message: "comment not founded" })
      } else if (targetComment.user_id !== req.user.id) {
        res.status(401).send({ message: "Unauthorized" })
      } else {
        targetComment.destroy()
        res.send({ message: `Comment id: ${req.params.comment_id} has been deleted.` })
      }
    })
}
          // try {
          //   let targetComment = await db.comment.findOne({
          //     where: { id: req.params.comment_id }
          //   })
          //   if (!targetComment) {
          //     res.status(404).send({ message: "comment not founded" })
          //   } else if (targetComment.user_id !== req.user.id) {
          //     res.status(401).send({ message: "Unauthorized" })
          //   } else {
          //     targetComment.destroy()
          //     res.send({ message: `Comment id: ${req.params.comment_id} has been delete.` })
          //   }
          // } catch (error) {
          //   console.log(error)
          //   res.status(400).send({ errorMessage: error.message })
          // }

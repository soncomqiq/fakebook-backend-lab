const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post('/create-post', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 1
      db.post.create({
        message: req.body.message,
        image_url: req.body.image_url,
        user_id: req.user.id,
      })
        .then(result => {
          res.status(201).send(result)
        })
        .catch(err => {
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.put('/update-post/:post_id', passport.authenticate('jwt', { session: false }),
    async function async(req, res) {
      // Lab 2
      const targetPost = await db.post.findOne({ where: { id: req.params.post_id } })
      if (!targetPost) {
        res.status(404).send({ message: "post not founded" })
      } else if (targetPost.user_id !== req.user.id) {
        res.status(401).send({ message: "Unauthorized" })
      } else {
        targetPost.update({
          message: req.body.message,
          image_url: req.body.image_url,
        })
        res.status(200).send({ message: `post id: ${req.params.post_id} has been updated` })
      }
    }
  )

  app.delete('/delete-post/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 3
      const targetPost = await db.post.findOne({ where: { id: req.params.post_id } })
      if (!targetPost) {
        res.status(404).send({ message: "post not founded" })
      } else if (targetPost.user_id !== req.user.id) {
        res.status(401).send({ message: "Unauthorized" })
      } else {
        targetPost.destroy()
        res.status(200).send({ message: `post id: ${req.params.post_id} has been deleted` })
      }
    })

  app.get("/my-posts",
    passport.authenticate("jwt", { session: false }),
    async function (req, res) {
      // Lab 4
      db.post.findAll({
        where: { user_id: req.user.id },
        include: [
          { model: db.user, as: 'author', attributes: ['id', 'name', ['profile_img_url', 'profilePic']] }
          ,
          {
            model: db.comment, as: 'commentList',
            include: [{ model: db.user, attributes: ['id', 'name', ['profile_img_url', 'profilePic']] }]
          }
        ]
      })
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          res.status(400).send({ message: err.message })
        })
    }
  );

  app.get('/feed', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 5
      let requestToList = await db.friend.findAll({
        where: { request_to_id: req.user.id, status: 'friend' },
        attributes: [['request_from_id', 'id']]
      })
      const requestFromIds = requestToList.map(request => request.id)

      let requestFromList = await db.friend.findAll({
        where: { request_from_id: req.user.id, status: 'friend' },
        attributes: [['request_to_id', 'id']]
      })
      const requestToIds = requestFromList.map(request => request.id)
      const postIds = requestToIds.concat(requestFromIds).concat([req.user.id])

      db.post.findAll({
        where: { user_id: postIds },
        include: [
          { model: db.user, as: 'author', attributes: ['id', 'name', ['profile_img_url', 'profilePic']] }
          ,
          {
            model: db.comment,
            as: 'commentList',
            attributes: ['id', 'message', 'author.id'],
            include: [{
              model: db.user,
              nested: false,
              required: true,
              attributes: ['id']
            }],
            raw: true
          }
        ]
      })
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          res.status(400).send({ message: err.message })
        })
    });
}

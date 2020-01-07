const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.get('/friend-request-to/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 1
      db.friend.create({
        request_to_id: req.params.id,
        request_from_id: req.user.id,
        status: "request",
      })
        .then(result => {
          res.status(201).send({ message: `Sends Request to friend id: ${req.params.id}` })
        })
        .catch(err => {
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.get('/request-list', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 2
      let requestList = await db.friend.findAll({
        where: { request_to_id: req.user.id, status: 'request' },
        attributes: [['request_from_id', 'id']]
      })
      const requestFromIds = requestList.map(request => request.id)
      const requestUser = await db.user.findAll({
        where: { id: { [Op.in]: requestFromIds } },
        attributes: ['id', 'name', 'profile_img_url']
      })
      res.send(requestUser)
    });

  app.get('/accept-friend-request/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 3
      db.friend.update({
        where: { request_from_id: req.params.id, request_to_id: req.user.id, status: "request" }
      })
        .then(result => {
          res.status(200).send(`เรียบร้อย`)
        })
        .catch(err => {
          res.status(400).send({ message: "something went wrong" })
        })
    }
  )


  app.get('/deny-friend-request/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.friend.destroy({
        where: {
          status: 'request',
          request_from_id: req.params.id,
          request_to_id: req.user.id
        }
      })
        .then(() => {
          res.status(200).send(`ปฎิเสธคำขเป็นเพื่อนกับผู้ใช้ ${req.params.id}`)
        })
        .catch(err => {
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.delete('/delete-friend/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 5
      let targetFriend = await db.friend.findOne({
        where: {
          [Op.or]: [
            { request_from_id: req.user.id, request_to_id: req.params.id, status: "friend" },
            { request_from_id: req.params.id, request_to_id: req.user.id, status: "friend" }]
        }
      })
      if (!targetFriend) {
        res.status(404).send({ message: `friend id: ${req.params.id} not found` })
      } else {
        targetFriend.destroy()
        res.status(200).send({ message: `friend id: ${req.params.id} has been deleted` })
      }
    }
  )

  // let friendResult
  // try {
  //   friendResult = await db.friend.findOne({
  //     where: {
  //       [Op.or]: [
  //         { request_to_id: req.params.id, request_from_id: req.user.id, status: "friend" },
  //         { request_to_id: req.user.id, request_from_id: req.params.id, status: "friend" }
  //       ]
  //     }
  //   })
  //   if (!friendResult) {
  //     res.status(404).json({ message: "not found friend" })
  //   }
  //   else {
  //     try {
  //       await friendResult.destroy()
  //       res.status(200).json({ message: "delete friend success" })
  //     } catch (error) {
  //       res.status(400).json({ message: "delete friend error" })
  //     }
  //   }
  // } catch (error) {
  //   res.status(400).json({ message: "bad request" })
  // }

  app.get('/friends-list', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 6
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
      const friendIds = requestToIds.concat(requestFromIds)

      db.user.findAll({
        where: { id: friendIds },
        attributes: ['id', 'name', 'profile_img_url']
      })
        .then(result => {
          res.send(result)
        })
        .catch(err => {
          res.status(400).send({ message: err.message })
        })
    });
}
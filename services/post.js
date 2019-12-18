const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post('/create-post', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 1
    }
  )

  app.put('/update-post/:id', passport.authenticate('jwt', { session: false }),
    async function async(req, res) {
      // Lab 2
    }
  )

  app.delete('/delete-post/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 3
    })

  app.get('/my-posts', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 4
    })

  app.get('/feed', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 5
    });
}

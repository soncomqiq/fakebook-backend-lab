const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post('/create-comment/:post_id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 1
    })

  app.put('/update-comment/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 2
    })

  app.delete('/delete-comment/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 3
    })
}

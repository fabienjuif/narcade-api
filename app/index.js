require('sugar')

/** Requires. */
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const request = require('request')

/** App configuration. */
app.use(bodyParser.json())

/** Express routes. */
app.post('/actions', (req, res) => {
    io.emit('action', req.body)
    res.end()
})

/** Socket.IO events. */
io.on('connection', (socket) => {
    socket.on('blame', (data) => {
      var message = data.slackName + " est mort sur NArcade.. C'te honte..."

      request.post('http://localhost:3000/messages', {
              json: true,
              body: {user: data.user, score: data.score, text: message}
          },
          (error, response, body) => {
              if (error) {
                socket.error('error', error)
              }
          })
    })

    socket.on('score', (data) => {
      // FIXME : Laisser le bot interpreter le message et passer par la stack hears
      var message = data.slackName + ' a fini sa partie de NArcade, il a fini avec un score de ' + data.score + ' !'

      request.post('http://localhost:3000/messages', {
              json: true,
              body: {user: data.user, score: data.score, text: message}
          },
          (error, response, body) => {
              if (error) {
                socket.error('error', error)
              }
          })
    })
})

/** Everything is ready, the server can listen. */
const port = 4000
http.listen(port, () => {
    console.log('listening on *:' + port)
})

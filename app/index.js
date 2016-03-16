require('sugar')

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.post('/actions', (req, res) => {
    io.emit('action', req.body)

    console.log('emit action : ' + JSON.stringify(req.body))

    res.end()
})

io.on('connection', function(socket) {
    const actions = [{
        action: 'destroy',
        user: '@julien'
    }, {
        action: 'up',
        user: '@guillaume'
    }, {
        action: 'down',
        user: '@antoine'
    }];

    (() => {
        io.emit('action', actions[Number.random(actions.length - 1)])
    }).every(2000)

    socket.on('score', function(msg) {
        console.log('move')
        console.log(JSON.stringify(msg))
    })
})

http.listen(4000, function() {
    console.log('listening on *:4000')
})
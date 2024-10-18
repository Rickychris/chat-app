const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New web socket connection')

    socket.emit('message', 'Welcome!')

    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', 'Server: '+ message)
        callback('Delivered!')
    })

    socket.on('sendLocation', (coords, callback) => {        
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        // io.emit('locationMessage', `Location: ${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})
server.listen(port, () => {
    console.log('Server is running on port ' + port)
})

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
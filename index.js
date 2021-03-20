const express = require('express')
const path = require('path')
const http = require('http')
const cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routes/users')
const messageRouter = require('./routes/messages')
const app = express()
const server = http.createServer(app);
const socket = require('socket.io')
const io = socket(server)
const User = require('./models/User')

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(messageRouter)




// Web Server Port 
const PORT =  process.env.PORT 

// Set up static directory to serve in express
app.use(express.static(path.join(__dirname, '/client/build')))


app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'))

}) 

server.listen(PORT, () => {
    console.log('Server is starting')
})

// Set io object to app
app.set('socketio',io)




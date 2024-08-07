import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()

const chatPort = process.env.PORT || 6001

const httpServer = createServer(app)

const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
})

io.on('connection', (socket) => {
	console.log('new connection received', socket.id)
	socket.on('disconnect', () => console.log('socket disconnected!'))
	socket.on('join_room', (data) => {
		// console.log('joining req received...!', data)
		socket.join(data.chatroom)
		io.in(data.chatroom).emit('user_joined', data)
	})
	socket.on('send_msg', (data) => {
		console.log('send msg received...!')
		io.in(data.chatroom).emit('receive_msg', data)
	})
})

/* RUN CHAT SERVER */
httpServer.listen(chatPort, function (err) {
	if (err) {
		console.log(`Error in running chat server : ${err}`)
	}

	console.log(`Chat Server is running on port: ${chatPort}`)
})

/* MIDDLEWARES */
app.use(cors())

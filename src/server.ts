import { config } from 'dotenv'; config();
import app from './app';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { registerSocketHandlers } from './sockets';

const HOST = process.env.HOST ?? 'localhost';
const PORT = process.env.PORT ?? 1234;

const server = createServer(app);
const io = new SocketIOServer(server, {
	cors: {
		origin: 'https://vocabzilla.onrender.com',
		credentials: true
	}
})

registerSocketHandlers(io);

server.listen(PORT, ()=> console.log(`\t 🚀 Server is running on http://${HOST}:${PORT}`));

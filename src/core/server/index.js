import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = express();
const PORT = 3307;
const WSPORT = 5000;
const SECRET = crypto.randomUUID();
app.use(express.json());
app.use(cors());

///////////////////////////////////WEBSOCKET////////////////////////////////////////////
const wss = new WebSocketServer({ port: WSPORT }, () => {
	console.log(`WebSocket server started on port: ${WSPORT}`);
});

const clients = new Map();

wss.on('connection', (ws) => {
	let currentChatId = null;
	
	ws.on('message', async (data) => {
		try {
			const message = JSON.parse(data);
			switch (message.event) {
				case 'join':
					currentChatId = message.chat_id;
					clients.set(ws, currentChatId);
					
					const messages = await getMessagesFromDB(currentChatId);
					ws.send(JSON.stringify({ event: 'history', messages }));
					
					break;
				case 'message':
					console.log('Received message:', message);
					await saveMessageToDB(message);
					broadcastMessage(message);
					break;
			}
		} catch (error) {
			console.error('Error processing message:', error);
		}
	});
	
	ws.on('close', () => {
		clients.delete(ws);
	});
});

function broadcastMessage(message) {
	wss.clients.forEach((client) => {
		if (clients.get(client) === message.chat_id) {
			client.send(JSON.stringify(message));
		}
	});
}

async function saveMessageToDB(message) {
	try {
		const { chat_id, message_from, message_text, date_message } = message;
		const query = 'INSERT INTO messages (id_chat, message_from, message_text, date_message) VALUES (?, ?, ?, ?)';
		console.log('Saving message to DB:', message);
		
		return new Promise((resolve, reject) => {
			connection.query(query, [chat_id, message_from, message_text, date_message], (error) => {
				if (error) {
					console.error(`Error saving message to DB: ${error.message}`);
					reject(error);
				} else {
					resolve();
				}
			});
		});
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}

async function getMessagesFromDB(chat_id) {
	return new Promise((resolve, reject) => {
		const query = 'SELECT * FROM messages WHERE id_chat = ? ORDER BY date_message ASC';
		connection.query(query, [chat_id], (error, results) => {
			if (error) {
				console.error(`Error fetching messages from DB: ${error.message}`);
				reject(error);
			} else {
				resolve(results);
			}
		});
	});
}
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'chatter',
	port: PORT,
});

app.get('/messages/:chat_id', (req, res) => {
	const chatId = req.params.chat_id;
	const query = 'SELECT * FROM messages WHERE id_chat = ? ORDER BY date_message ASC';
	
	connection.query(query, [chatId], (error, results) => {
		if (error) {
			console.error(`Error fetching messages: ${error.message}`);
			return res.status(500).send('Server error');
		}
		res.status(200).json(results);
	});
});

app.get('/chat/:id', (req, res) => {
	const chatId = req.params.id;
	connection.query('SELECT * FROM chats WHERE id = ?', [chatId], (error, result) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return res.status(500).send('Server error');
		}
		if (result.length === 0) {
			return res.status(404).send('Chat not found');
		}
		res.status(200).json(result[0]);
	});
});

app.get('/showChat', (req, res) => {
	connection.query('SELECT * FROM chats', (error, result) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return res.status(500).send('Server error');
		}
		res.status(200).send(result);
	});
});

app.post('/deleteChat', (req, res) => {
	const chatId = req.body.chatId;
	
	connection.beginTransaction((err) => {
		if (err) {
			console.error(`Error: ${err.message}`);
			return res.status(500).send('Server error');
		}
		
		connection.query('DELETE FROM messages WHERE id_chat = ?', [chatId], (error, result) => {
			if (error) {
				return connection.rollback(() => {
					console.error(`Error: ${error.message}`);
					res.status(500).send('Server error');
				});
			}
			
			connection.query('DELETE FROM chats WHERE id = ?', [chatId], (error, result) => {
				if (error) {
					return connection.rollback(() => {
						console.error(`Error: ${error.message}`);
						res.status(500).send('Server error');
					});
				}
				
				connection.commit((err) => {
					if (err) {
						return connection.rollback(() => {
							console.error(`Error: ${err.message}`);
							res.status(500).send('Server error');
						});
					}
					
					res.status(200).send({ message: 'Chat and associated messages deleted successfully' });
				});
			});
		});
	});
});


app.post('/register', (req, res) => {
	try {
		const { userName, userPassword, registrationDate, lastActivity } = req.body;
		
		connection.query(
			'INSERT INTO users (user_name, password, registration_date, last_activity) VALUES (?, ?, ?, ?)',
			[userName, encryptPassword(userPassword), registrationDate, lastActivity],
			(error) => {
				if (error) {
					res.status(500).send(`Error: ${error.message}`);
				} else {
					res.status(200).send('User created!');
				}
			}
		);
	} catch (error) {
		res.status(500).send(`Error: ${error.message}`);
	}
});

app.post('/login', (req, res) => {
	try {
		const { userName, userPassword } = req.body;
		
		connection.query('SELECT * FROM users WHERE user_name = ?', [userName], (error, result) => {
			if (error) {
				res.status(500).send(`Error: ${error.message}`);
			} else {
				if (result.length === 0) {
					res.status(401).send('Invalid credentials');
				} else {
					const user = result[0];
					const decryptPassword = decrypttPassword(user.password);
					
					if (decryptPassword === userPassword) {
						const token = generateToken({ userName: user.user_name, userId: user.id });
						res.status(200).json({
							token,
							userName: user.user_name,
							userId: user.id,
						});
					} else {
						res.status(401).send('Invalid credentials');
					}
				}
			}
		});
	} catch (error) {
		res.status(500).send(`Error: ${error.message}`);
	}
});


app.post('/auto-login', (req, res) => {
	try {
		const { token } = req.body;
		const data = verifyToken(token);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).send(`Error: ${error.message}`);
	}
});

app.post('/createChat', (req, res) => {
	try {
		const { chatName, themeChat, privateChat, createdById, createdByName } = req.body;
		
		if (!chatName || !createdById || !createdByName) {
			return res.status(400).send('Invalid input');
		}
		
		connection.query(
			'INSERT INTO chats (chat_name, created_byId, created_byName, chat_theme, private) VALUES (?, ?, ?, ?, ?)',
			[chatName, createdById, createdByName, themeChat, privateChat],
			(error) => {
				if (error) {
					res.status(500).send(`Error: ${error.message}`);
				} else {
					res.status(200).send('Chat created!');
				}
			}
		);
	} catch (error) {
		res.status(500).send(`Error: ${error.message}`);
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

connection.connect((error) => {
	if (error) {
		console.log(`Error: ${error.message}`);
	} else {
		console.log('Connection to database success');
	}
});

function encryptPassword(password) {
	let encryptPassword = '';
	let alphabet = 'abcdefghijklmnopqrstuvwxyz';
	
	for (let i = 0; i < password.length; i++) {
		encryptPassword += alphabet[i % alphabet.length] + '2' + password[i];
	}
	
	return encryptPassword.split('').reverse().join('');
}

function decrypttPassword(encryptedPassword) {
	let decryptedPassword = '';
	let reversedEncryptedPassword = encryptedPassword.split('').reverse().join('');
	for (let i = 0; i < reversedEncryptedPassword.length; i += 3) {
		decryptedPassword += reversedEncryptedPassword[i + 2];
	}
	return decryptedPassword;
}

function generateToken(payload, expiresIn = "6h") {
	return jwt.sign(payload, SECRET, { expiresIn });
}

function verifyToken(token) {
	try {
		return jwt.verify(token, SECRET);
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}

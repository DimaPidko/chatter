import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'


const app = express();
const PORT = 3307;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'chatter',
	port: PORT
})

app.post('/chatter', (req, res) => {
	try {
		const { userName, userPassword } = req.body
		
		connection.query('INSERT INTO users (user_name, password) VALUES (?, ?)', [userName, userPassword], (error) => {
			if (error) {
				res.status(500).send(`Error: ${error.message}`)
			} else {
				res.status(200).send('User created!')
			}
		})
	} catch (error) {
		res.status(500).send(`Error: ${error.message}`)
	}
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

connection.connect((error) => {
	if (error) {
		console.log(`Error: ${error.message}`)
	} else {
		console.log('Connection to database success')
	}
})
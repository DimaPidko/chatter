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

app.post('/register', (req, res) => {
	try {
		const { userName, userPassword } = req.body
		
		connection.query('INSERT INTO users (user_name, password) VALUES (?, ?)', [userName, encryptPassword(userPassword)], (error) => {
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

app.post('/login', (req, res) => {
	
	const { userName, userPassword } = req.body
	
	try {
		connection.query('SELECT * FROM users WHERE user_name = ? ', [userName], (error, result) => {
			if (error) {
				res.status(500).send(`Error: ${error.message}`)
			} else {
				if (result.length === 0) {
					res.status(401).send('Invalid credentials')
				} else {
					const user = result[0]
					const decryptPassword = decrypttPassword(user.password)
					
					if(decryptPassword === userPassword) {
						res.status(200).json(user)
					} else {
						res.status(401).send('Invalid credentials')
					}
				}
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



function encryptPassword(password) {
	let encryptPassword = ""
	let alphabet = 'abcdefghijklmnopqrstuvwxyz'
	
	for (let i = 0; i < password.length; i++) {
		encryptPassword += alphabet[i % alphabet.length] + '2' + password[i]
	}
	
	return encryptPassword.split('').reverse().join('')
}

function decrypttPassword(encryptedPassword) {
	let decryptedPassword = "";
	let reversedEncryptedPassword = encryptedPassword.split("").reverse().join("");
	for (let i = 0; i < reversedEncryptedPassword.length; i += 3) {
		decryptedPassword += reversedEncryptedPassword[i + 2];
	}
	return decryptedPassword;
}
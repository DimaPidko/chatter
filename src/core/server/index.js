import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'

const app = express();
const PORT = 5174;

app.use(bodyParser.json());

app.put('./users.json', (req, res) => {
	const newUser = req.body;
	
	// Читаем текущих пользователей из файла
	fs.readFile('./users.json', 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Ошибка чтения файла' });
		}
		
		const users = data ? JSON.parse(data) : [];
		users.push(newUser);
		
		// Записываем обновленный массив пользователей обратно в файл
		fs.writeFile('./users.json', JSON.stringify(users, null, 2), (err) => {
			if (err) {
				return res.status(500).json({ error: 'Ошибка записи в файл' });
			}
			res.json(newUser);
		});
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

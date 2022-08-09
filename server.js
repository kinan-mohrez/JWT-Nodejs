require('dotenv').config();
const { verify } = require('crypto');
const express = require('express');
const server = express();
const port = 3000;
var jwt = require('jsonwebtoken');
const path = require('path');

server.use(express.static(__dirname + '/css'));
server.use(express.json());
server.use(express.urlencoded());

server.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname + '/tokenForm.html'));
});

server.post('/connect', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const user = { username, password };
	// res.send(username + '  ' + password);
	if (username === 'john' && password === 'doe') {
		const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: '1800s',
		});

		res.sendFile(path.join(__dirname + '/tokenForm.html'));
	} else {
		res.redirect('/login');
	}
	console.log(req.session.isConnected);
});

const verifyToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStauts(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStauts(403);
		req.user = user;
		next();
	});
};

server.get('/', (req, res) => {
	res.send('Hello World!');
});

server.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

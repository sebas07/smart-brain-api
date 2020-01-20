const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

const database = {
    users: [
        {
            id: 1,
            name: 'Sebastian',
            email: 'sebas@gmail.com',
            password: 'sebas123',
            entries: 10,
            joinDate: new Date()
        },
        {
            id: 2,
            name: 'Hector',
            email: 'hector@gmail.com',
            password: 'hector123',
            entries: 5,
            joinDate: new Date()
        }
    ],
    login: [
        {
            id: 1000,
            email: 'sebas@gmail.com',
            password: '$2a$10$Uf7VrVwfaec6fhOURJvM8Oq8Su5vqxfUfErOmC9NbZym/7t9C6qo2' //sebas123
        },
        {
            id: 1001,
            email: 'hector@gmail.com',
            password: '$2a$10$/SkvXHddEAALuRrtKBkt2OsuCggodQflzuFCJUf2sa2dF9Fr2y9lm' // hector123
        }
    ]
};

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(database.users);
});

app.post('/register', (req, res) => {
    let { name, email, password, hashPW } = req.body;

    bcrypt.hash(password, null, null, function(err, hash) {
        hashPW = hash;
    });

    console.log('hash: ', hashPW);

    database.users.push({
        id: 3,
        name: name,
        email: email,
        password: password,
        entries: 0,
        joinDate: new Date()
    });
    res.json(database.users[database.users.length - 1]);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) 
    {
        res.json(database.users[0]);
    } else {
        res.status(400).json('invalid signin');
    }
});

app.get('/profile/:id', (req, res) => {
    let { id } = req.params;
    let user = database.users.find(tmpUser => tmpUser.id == id);
    if (user !== undefined) {
        res.json(user);
    } else {
        res.status(400).json('User not found');
    }
});

app.put('/image', (req, res) => {
    let { id } = req.body;
    let user = database.users.find(tmpUser => tmpUser.id == id);
    if (user !== undefined) {
        user.entries++;
        res.json(user.entries);
    } else {
        res.status(400).json('User not found');
    }
});

app.listen(3001, () => {
    console.log('App is running in port 3001');
});

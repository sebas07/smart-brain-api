const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const connection = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'sebastianrodriguez',
        password : '',
        database : 'smartbrain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json('home');
});

app.post('/register', (req, res) => {
    let { name, email, password } = req.body;
    let passwordHash = bcrypt.hashSync(password);

    connection.transaction(trx => {
        trx('userlogin')
        .insert({
            email: email,
            hash: passwordHash
        })
        .returning('email')
        .then(loginEmail => {
            if (loginEmail.length) {
                return trx('users')
                .returning('*')
                .insert({
                    name: name, 
                    email: loginEmail[0], 
                    joindate: new Date()
                })
                .then(response => {
                    if (response.length) {
                        res.json(response[0]);
                    }
                })
            }
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register the user'));
});

app.post('/signin', (req, res) => {
    let { email, password } = req.body;
    connection.select('email', 'hash').from('userlogin').where({ email: email })
    .then(data => {
        if (data.length) {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return connection.select('*').from('users').where({ email: email })
                .then(user => {
                    if (user.length) {
                        res.json(user[0]);
                    } else {
                        res.status(400).json('User not found');
                    }
                })
                .catch(err => res.status(400).json('error getting the user'));
            } else {
                res.status(400).json('invalid signin');
            }
        } else {
            res.status(400).json('invalid signin');
        }
    })
    .catch(err => res.status(400).json('invalid signin'));
});

app.get('/profile/:id', (req, res) => {
    let { id } = req.params;
    connection.select('*').from('users').where({ id: id })
    .then(response => {
        if (response.length) {
            res.json(response[0]);
        } else {
            res.status(400).json('User not found');
        }
    })
    .catch(erro => res.status(400).json('error getting the user'));
});

app.put('/image', (req, res) => {
    let { id } = req.body;
    connection('users').returning('entries').where({ id: id }).increment('entries', 1)
    .then(response => {
        if (response.length) {
            res.json(response[0]);            
        } else {
            res.status(400).json('User not found');
        }
    })
    .catch(err => res.status(400).json('error updating the user'));
});

app.listen(3001, () => {
    console.log('App is running in port 3001');
});

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/Register');
const signIn = require('./controllers/SignIn');
const userProfile = require('./controllers/UserProfile');
const userUpdate = require('./controllers/UserUpdate');

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

app.get('/', (req, res) => { res.json('home') });

app.put('/image', (req, res) => { userUpdate.handleUserUpdate(req, res, connection) });

app.get('/profile/:id', (req, res) => { userProfile.handleUserProfile(req, res, connection) });

app.post('/register', (req, res) => { register.handleRegister(req, res, bcrypt, connection) });

app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, bcrypt, connection) });

app.listen(3001, () => { console.log('App is running in port 3001'); });

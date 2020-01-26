
const handleSignIn = (req, res, bcrypt, connection) => {
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
}

module.exports = {
    handleSignIn: handleSignIn
}

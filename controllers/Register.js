
const handleRegister = (req, res, bcrypt, connection) => {
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
}

module.exports = {
    handleRegister: handleRegister
}

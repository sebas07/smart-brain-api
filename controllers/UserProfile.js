
const handleUserProfile = (req, res, connection) => {
    let { id } = req.params;
    connection.select('*').from('users').where({ id: id })
    .then(response => {
        if (response.length) {
            res.json(response[0]);
        } else {
            res.status(400).json('User not found');
        }
    })
    .catch(err => res.status(400).json('error getting the user'));
}

module.exports = {
    handleUserProfile: handleUserProfile
}


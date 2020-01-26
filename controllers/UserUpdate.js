
const handleUserUpdate = (req, res, connection) => {
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
}

module.exports = {
    handleUserUpdate: handleUserUpdate
}

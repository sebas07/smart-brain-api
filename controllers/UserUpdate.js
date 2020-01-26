const Clarifai = require('clarifai');

const faceRecognitionApp = new Clarifai.App({
    apiKey: '99e226a315c345aa867b7dcb3c2a2bbb'
   });

const handleClarifaiApiCall = (req, res) => {
    faceRecognitionApp.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.userInput)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('unable to work with API'));
}

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
    handleUserUpdate: handleUserUpdate,
    handleClarifaiApiCall: handleClarifaiApiCall
}

const mongoose = require('mongoose');

const dbConnection = async () => {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/fac_db_prod', {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true
        }).then(db => console.log('conexion exitosa'))
        .catch(err => console.log('error: ', err))
}


module.exports = {
    dbConnection
}

const mongoose = require('mongoose');


const dbConnection = async () => {

    try {

        await mongoose.connect( process.env.DB_NN);

        console.log('DB Online');

    } catch (error){
        console.log(error);
        throw new Error('Erroe en la base de datos -Hable con el admín')
    }
}

module.exports = {
    dbConnection
}
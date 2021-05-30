const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin:t8CPXOMvPxCugq3L@cluster0.dohry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {  useNewUrlParser: true });

const db = mongoose.connection;

db.on('error' , console.error.bind(console , "Error while connecting to database"));

db.once('open' , function(){
    console.log("Server connected to :: MongoDb ");
})

module.exports = db;
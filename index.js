const express = require ('express');
const path = require ('path');
const mongoose = require ('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Mongo_URI:', process.env.MONGO_URI); // add this before mongoose.connect


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));



const app = express();

app.get('/', (req, res) =>{
    res.send("instant app");
});

const PORT = process.env.PORT|| 5000;

app.listen(PORT,()=> console.log (`server started on port ${PORT}`));

const express = require ('express');
const path = require ('path');
const cors = require ('cors');
const helmet = require ('helmet');
const cookieParse = require ('cookie-parser');

const mongoose = require ('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
console.log('Mongo_URI:', process.env.MONGO_URI); // add this before mongoose.connect


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));



app.use(cors());
app.use(helmet());
app.use(cookieParse());
app.use(express.json());
app.use(express.urlencoded({extended: true}));




app.get('/', (req, res) =>{
    res.send("instant app");
});

const PORT = process.env.PORT|| 5000;

app.listen(PORT,()=> console.log (`server started on port ${PORT}`));

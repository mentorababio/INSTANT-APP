const express = require ('express');
const path = require ('path');


const app = express();

app.get('/', (req, res) =>{
    res.send("instant app");
});

const PORT = process.env.PORT|| 5000;

app.listen(PORT,()=> console.log (`server started on port ${5000}`));

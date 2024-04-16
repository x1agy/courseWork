const { MongoClient } = require('mongodb');
const express = require('express');

const app = express();
const port = 3001;
const client = new MongoClient('mongodb://localhost:27017');

(async () => {
    try{
        const a = await client.connect();
        console.log('Success connection');
    }catch(e){
        console.log(e);
    }
})()

app.get('/users', async (req, res) => {
    try{
        const responseFromDB = await client.connect();
        res.send(responseFromDB.db);
    }catch(e){
        console.log(e);
        res.send(e);
    }
})

app.listen(port, () => {
    console.log('Success connection');
})
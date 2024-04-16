const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const port = 3001;
const client = new MongoClient('mongodb://localhost:27017/courseDB');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.get('/users', async (req, res) => {
    try{
        await client.connect();
        const users = await client.db().collection('users').find({}).toArray();
        res.send(users);
    }catch(e){
        console.log(e);
        res.send(e);
    }
})

app.get('/teachers', async (req, res) => {
    try{
        await client.connect();
        const teachers = await client.db().collection('teachers').find({}).toArray();
        res.send(teachers);
    }catch(e){
        console.log(e);
        res.send(e);
    }
})

app.delete('/users/delete', async (req, res) => {
    try{
        await client.connect();
        client.db().collection('users').deleteOne({_id: new ObjectId(req.body.id)})
        res.send('success');
    }catch(e){
        console.log(e);
        res.send(e);
    }
})

app.post('/users/post', async (req, res) => {
    try{
        await client.connect();
        client.db().collection('users').insertOne(req.body);
        res.send('success');
    }catch(e){
        console.log(e);
        res.send(e)
    }
})

app.post('/users/edit', async (req, res) => {

    const filter = { _id: new ObjectId(req.body.id)};

    delete req.body.id;

    const updateDoc = {
        $set: {
            ...req.body
        },
    };

    try{
        await client.connect();
        client.db().collection('users').updateOne(filter, updateDoc);
        res.send('success');
    }catch(e){
        console.log(e);
        res.send(e)
    }
})

app.listen(port, () => {
    console.log('Success connection');
})
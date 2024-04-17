const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const client = new MongoClient(process.env.DB_URL);
const app = express();
const port = 3001;

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

app.post('/confirm_email', async (req, res) => {

    const randomCode = Math.floor(Math.random() * (1000000 - 99999 + 1) + 99999);

    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.LOGIN,
                pass: process.env.PASSWORD,
            },
        });
        
        await transporter.sendMail({
            from: 'Andrews music school',
            to: req.body.login,
            subject: 'Message from Andrews music school',
            text: 'bibiibibi',
            html: 'Here is your code: ' + randomCode,
        });

        res.send(JSON.stringify(randomCode))
    }catch (e) {
        console.log(e);
        res.send(e);
    }
})

app.post('/create_account', async (req, res) => {
    try{
        await client.connect();
        await client.db().collection('users').insertOne(req.body)
        res.send('success');
    }catch(e){
        console.log(e);
        res.send(e);
    }
})

app.listen(port, () => {
    console.log('Success connection');
})
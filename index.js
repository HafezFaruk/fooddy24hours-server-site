const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0hj4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('fooddy24h');
        const sreviceCollection = database.collection('services');

        // GET ALL DATA
        app.get('/services', async (req, res) => {
            const cursor = sreviceCollection.find({});
            const services = await cursor.toArray(cursor);
            res.send(services)

        });

        // GET Single Service
        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            console.log('getting single data',id);
            const query = { _id: ObjectId(id) };
            const service = await sreviceCollection.findOne(query);
            console.log('find single services',service);
            res.json(service);

        });

       
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updateService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateService.name,
                    price: updateService.price,
                    description: updateService.description,
                    img: updateService.img
                }
            }
            const result = await sreviceCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

 
        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await sreviceCollection.insertOne(service);
            res.json(result)
        });

        // DELETE API 
        app.delete('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id) };
            const result = await sreviceCollection.deleteOne(query);
            res.json(result);

        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.otlpr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('evergreenOne');
        const myCollection = database.collection('dataOne');
        // console.log('database connected successfully');
        // Get API
        app.get('/users', async (req, res) => {
            const cursor = myCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })




        // Post API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await myCollection.insertOne(newUser);
            console.log('Hitting the Post', req.body);
            console.log('added User', result);
            res.json(result);
        });

        //Delete API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myCollection.deleteOne(query);
            console.log('delete user id', result);
            res.json(result);
        })

    }

    finally {
        // await client.close();
    }
}
// Main Data
// async function run() {
//     try {
//         await client.connect();
//         const database = client.db('evergreenMain');
//         const myCollection = database.collection('alldatas');

//         // Get main API
//         app.get('/alldatas', async (req, res) => {
//             const cursor = myCollection.find({});
//             const datas = await cursor.toArray();
//             res.send(datas);
//         })


//     }
//     finally {
//         // await client.close();
//     }
// }
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello This');
})

app.listen(port, () => {
    console.log('Cooling to my port', port);
})








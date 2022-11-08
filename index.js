const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;


const app = express();

// middleware .................
app.use(cors());
app.use(express.json());

const services = require('./services.json')


// MongoDb database connnection..............


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.geiv5ao.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {

        // collections ...............
        const servicesCollections = client.db('CreativePhotograph').collection('services');
        const reviewsCollections = client.db('CreativePhotograph').collection('reviews');


        // get limit of services data ...........................
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollections.find(query).limit(3);
            const services = await cursor.toArray()

            res.send(services);
        })
        // get all services data.................................
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = servicesCollections.find(query);
            const allServices = await cursor.toArray();

            res.send(allServices);
        })

        // get specific service using filtering with id.........................
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const service = await servicesCollections.findOne(query);

            res.send(service);
        })







    }
    finally {

    }

}
run().catch(error => console.log(error.message)
)




app.get('/', (req, res) => {
    res.send('Server is working!')
})


// app.get('/services', (req, res) => {
//     const limitService = services.slice(0, 3);
//     res.send(limitService)
// })

// app.get('/allservices', (req, res) => {
//     res.send(services);
// })

// app.get('/service/:id', (req, res) => {
//     const id = req.params.id;
//     const service = services.find(ser => ser.id === id)
//     res.send(service)
// })

app.listen(port, () => {
    console.log(`server is runnign on port: ${port}`);
})
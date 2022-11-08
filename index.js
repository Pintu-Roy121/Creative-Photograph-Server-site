const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;


const app = express();

// middleware .................
app.use(cors());
app.use(express.json());


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
            // const cursor = Math.random(servicesCollections.find(query).limit(3));
            const services = await cursor.toArray()

            res.send(services);
        })
        // get add set all services data.................................
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = servicesCollections.find(query);
            const allServices = await cursor.toArray();

            res.send(allServices);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;

            const result = await servicesCollections.insertOne(service)
            res.send(result)
        })

        // get specific service using id.........................
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const service = await servicesCollections.findOne(query);

            res.send(service);
        })

        // get and post all reviews .............................
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewsCollections.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;

            const result = await reviewsCollections.insertOne(review);
            res.send(result)
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                service_id: id
            }
            const reviews = reviewsCollections.find(query);
            const result = await reviews.toArray();
            res.send(result)
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


app.listen(port, () => {
    console.log(`server is runnign on port: ${port}`);
})
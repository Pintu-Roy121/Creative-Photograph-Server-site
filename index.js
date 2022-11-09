const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query, application } = require('express');
require('dotenv').config();


const port = process.env.PORT || 5000;


const app = express();

// middleware .................
app.use(cors());
app.use(express.json());


// MongoDb database connnection..............
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.geiv5ao.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('UnAuthorized Access');
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, function (error, decoded) {
        if (error) {
            return res.status(401).send('UnAuthorized Access');
        }
        req.decoded = decoded;
        next();
    })
}

const run = async () => {
    try {

        // collections ...............
        const servicesCollections = client.db('CreativePhotograph').collection('services');
        const reviewsCollections = client.db('CreativePhotograph').collection('reviews');


        // Creater JWT secret token..............
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1d' });
            res.send({ token })
        })

        // get limit of services data ...........................
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollections.find(query).limit(3).sort({ time: -1 });
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

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollections.insertOne(review);
            res.send(result)
        })


        // get specific service reviews...............................
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                service_id: id
            }
            const reviews = reviewsCollections.find(query);
            const result = await reviews.toArray();
            res.send(result)
        })

        // get specific review for edit...........................
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id),
            }
            const result = await reviewsCollections.findOne(query);
            res.send(result)

        })

        // get specific sorted reviews of every user......................
        app.get('/reviews', verifyJWT, async (req, res) => {
            const decoded = req.decoded;

            if (decoded.email !== req.query.email) {
                res.status(403).send({ message: 'UnAuthorized Access' })
            }

            const email = req.query.email;
            const query = {
                email: email
            }
            const cursor = reviewsCollections.find(query).sort({ time: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/reviews/:id', async (req, res) => {
            const { id } = req.params;
            const query = {
                _id: ObjectId(id)
            }
            const result = await reviewsCollections.deleteOne(query);
            res.send(result)
        })

        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body;

            const filter = {
                _id: ObjectId(id),
            }

            const updateReview = {
                $set: {
                    image: review.image,
                    rating: review.rating,
                    description: review.description
                }
            }
            const result = await reviewsCollections.updateOne(filter, updateReview);
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
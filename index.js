const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware .................
app.use(cors());
app.use(express.json());

const services = require('./services.json')

app.get('/', (req, res) => {
    res.send('Server is working!')
})


app.get('/services', (req, res) => {
    res.send(services)
})

app.listen(port, () => {
    console.log(`server is runnign on port: ${port}`);
})
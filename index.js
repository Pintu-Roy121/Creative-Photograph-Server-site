const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware .................
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is working for crative Photograph!')
})

app.listen(port, () => {
    console.log(`server is runnign on port: ${port}`);
})
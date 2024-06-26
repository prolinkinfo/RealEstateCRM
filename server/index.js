const express = require('express');
const db = require('./db/config')
const route = require('./controllers/route');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5001
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const Grid = require("gridfs-stream")
const mongoose = require("mongoose")

const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');



//Setup Express App
const app = express();
// Middleware
app.use(bodyParser.json());
// Set up CORS  
app.use(cors())
//API Routes
app.use('/api', route);


// let gfs;
// const conn = mongoose.connection;
// conn.once('open', () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection("outSales")
// })
let gfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gfsBucket = new GridFSBucket(conn.db, {
        bucketName: 'outSales'
    });
    console.log('GridFSBucket connected');
});


app.get("/file/:fileName", async (req, res) => {
    try {
        // const file = await gfs.files.findOne({ filename: req.params.fileName });
        // console.log("file--::", file)
        // const readStrean = gfs.createReadStream(file.filename)
        // console.log("readStrean--::", readStrean)
        // readStrean.pipe(res)

        const files = await conn.db.collection('outSales.files').find().toArray();

        if (!files || files.length === 0) {
            return res.status(404).send('No files found');
        }

        res.setHeader('Content-Type', 'application/octet-stream');

        files.forEach(async (file) => {
            const readStream = gfsBucket.openDownloadStream(file._id);
            readStream.pipe(res, { end: false });
        });

        res.end();


        // const fileName = req.params.fileName;
        // const file = await conn.db.collection('outSales.files').findOne({ filename: fileName });

        // if (!file) {
        //     return res.status(404).send('File not found');
        // }

        // const readStream = gfsBucket.openDownloadStreamByName(fileName);
        // readStream.on('error', (err) => {
        //     console.error('Error in readStream:', err);
        //     res.status(500).send('Error retrieving file');
        // });

        // res.setHeader('Content-Type', file.contentType);
        // readStream.pipe(res);

    } catch (e) {
        res.send("not found")
        console.log("Error : ", e)
    }
})

app.get('/', async (req, res) => {
    res.send('Welcome to my world...')
});

// Get port from environment and store in Express.

const server = app.listen(port, () => {
    const protocol = (process.env.HTTPS === 'true' || process.env.NODE_ENV === 'production') ? 'https' : 'http';
    const { address, port } = server.address();
    const host = address === '::' ? '127.0.0.1' : address;
    console.log(`Server listening at ${protocol}://${host}:${port}/`);
});


// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || 'Prolink'

db(DATABASE_URL, DATABASE);
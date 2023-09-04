const express = require('express');
const db = require('./db/config')
const route = require('./controllers/route');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5001
require('dotenv').config()
const fs = require('fs');
const path = require('path');

//Setup Express App
const app = express();
// Middleware
app.use(bodyParser.json());
// Set up CORS  
app.use(cors())
//API Routes
app.use('/api', route);

app.get('/', async (req, res) => {

    res.send('Welcome to my world...')

    //! for Delete folder ./uploads
    // const folderPath = './uploads'; // Use the appropriate path here
    // try {
    //     function removeFolderRecursive(folderPath) {
    //         if (fs.existsSync(folderPath)) {
    //             fs.readdirSync(folderPath).forEach(file => {
    //                 const curPath = path.join(folderPath, file);

    //                 if (fs.lstatSync(curPath).isDirectory()) {
    //                     removeFolderRecursive(curPath); // Recursive call for subdirectories
    //                 } else {
    //                     fs.unlinkSync(curPath); // Delete file
    //                 }
    //             });

    //             fs.rmdirSync(folderPath); // Remove empty directory
    //             console.log(`Folder ${folderPath} and its contents have been removed.`);
    //         }
    //     }
    //     removeFolderRecursive(folderPath);
    //     res.send({ message: `Folder ${folderPath} and its contents have been removed.` });
    // } catch (err) {
    //     console.error(`Error removing folder: ${err.message}`);
    //     res.status(500).send({ message: `Error removing folder: ${err.message}` });
    // }
});

// Get port from environment and store in Express.

const server = app.listen(port, () => {
    const protocol = (process.env.HTTPS === 'true' || process.env.NODE_ENV === 'production') ? 'https' : 'http';
    const { address, port } = server.address();
    const host = address === '::' ? '127.0.0.1' : address;
    console.log(`Server listening at ${protocol}://${host}:${port}`);
});


// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
// const DATABASE_URL = 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || 'Prolink'

db(DATABASE_URL, DATABASE);
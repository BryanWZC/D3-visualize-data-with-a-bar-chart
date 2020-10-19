'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
//app.use(morgan('dev'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.js'));
});



app.listen(port, () => {
    console.log(`Server connection at port ${port}`)
});
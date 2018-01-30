const express = require('express');
const app = express();

const config = require('./config/database');
const mongoose = require('mongoose');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) {
        console.log('Could not connect to database', err);
    } else {
        //console.log('Secret: ', config.secret);
        console.log('Connected to database', config.db);
    }
});

app.use(express.static(__dirname + '/client/dist/'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen('8080', () => {
    console.log('Server started at port 8080');
});
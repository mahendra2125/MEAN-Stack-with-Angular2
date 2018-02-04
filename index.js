const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const path = require('path');
const config = require('./config/database');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) {
        console.log('Could not connect to database', err);
    } else {
        console.log('Connected to database', config.db);
    }
});

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen('8080', () => {
    console.log('Server started at port 8080');
});
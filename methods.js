const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');

const app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.post('/', (req, res) => {
    res.send('post method call.')
})

app.get('/', (req, res) => {
    res.send('get method call.')
})

app.put('/', (req, res) => {
    res.send('put method call.')
})

app.delete('/', (req, res) => {
    res.send('delete method call.')
})

app.get('/method',( req, res) => {
    res.render('indexMethod');
})

app.listen(3000, () => {
    console.log('App is running on port 3000');
})

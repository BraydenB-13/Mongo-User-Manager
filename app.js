const express = require('express');
const uuid = require('uuid');
const mongoose = require('mongoose');

const app = express();
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

const dbConnectionString = 'mongodb://localhost/mtech';
mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false)

const userSchema = new mongoose.Schema({
    id: String,
    first: String,
    last: String,
    email: String,
    age: Number
})

const users = mongoose.model('Users', userSchema);

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.get('/list', (req, res) => {
    users.find({}, (err, data) => {
        if (err) throw err;
        res.render('list', { users: data })
    })
})

app.post('/list', (req, res) => {
    let newUser = new users();
    newUser.id = uuid.v4();
    newUser.first = req.body.first;
    newUser.last = req.body.last;
    newUser.email = req.body.email;
    newUser.age = req.body.age;

    newUser.save((err) => {
        if (err) throw err
        res.redirect('/list')
    })
})

app.get('/edit/:id', (req, res) => {
    users.findOne({ id: req.params.id }, (err, data) => {
        if (err) throw err;
        res.render('edit', { user: data })
    })
})

app.post('/edit/:id', (req, res) => {
    users.findOneAndUpdate({ id: req.params.id }, {
        id: req.body.id,
        first: req.body.first,
        last: req.body.last,
        email: req.body.email,
        age: req.body.age
    }, (err) => {
        if (err) throw err;
        res.redirect('/list')
    })
})

app.post('/remove/:id', (req, res) => {
    users.findOneAndDelete({ id: req.params.id }, (err, data) => { 
        if (err) throw err
        res.redirect('/list')
    })
})

app.post('/sort', (req, res) => {
    if (req.body.sort =='search') {
        users.find({ first: req.body.search }, (err, data) => {
            if (err) throw err;
            res.render('list', { users: data })
        })
    } else
    if (req.body.sort == 'ascending') {
        users.find({}, null, { sort: {first: 1} }, (err, data) => {
            if (err) throw err;
            res.render('list', { users: data })
        })
    } else
    if (req.body.sort == 'descending') {
        users.find({}, null, { sort: {first: -1} }, (err, data) => {
            if (err) throw err;
            res.render('list', { users: data })
        })
    }
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})
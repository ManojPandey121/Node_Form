
const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const app = express();

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'conv-list';
app.set('view engine','ejs');

// mongoClient.connect(url, { useUnifiedTopology: true }, { useNewUrlParser: true }, (err, client) => {
//     if (err) return console.log(err)
//     db = client.db(dbName);
//     console.log(`Connected Mongodb: ${url}`);
//     console.log(`Database: ${dbName}`);
// })

// mongoClient.connect(url,{useUnifiedTopology:true},(err,client) => {
//     if (err) return console.error(err)
//     console.log('Connected to Database');
// })

mongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        const db = client.db(dbName);
        const dbCollection = db.collection('profile');

        app.use(bodyParser.urlencoded({ extended: true }))

        app.get('/', (req, res) => {
            // res.send('Hello World');
            dbCollection.find().toArray()
            .then(result => {
                console.log(result);
                res.render('index.ejs',{profile:result});
            })
            .catch(error=>console.error(error));
            // res.sendFile(__dirname + '/index.html');
            
        })

        app.post('/quotes', (req, res) => {
            var timestamps = {
                timestamp: Date.now(),
            }
            var reschedule = {
                reschedule: 'off'
            }
            if (!("reschedule" in req.body)) {
                var data = Object.assign(req.body, reschedule);
            }
            var data = Object.assign(req.body, timestamps);

            dbCollection.insertOne(data)
                .then(result => {
                    console.log(result);
                    res.redirect('/');
                })
                .catch(error => console.error(error));


        })

        app.listen(9000, function () {
            console.log("Listening on 9000");
        })

    })
    .catch(error => console.error(error));





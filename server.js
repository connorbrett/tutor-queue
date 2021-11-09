/*
    Connor Brett
    This file is the server for the final project. It receives AJAX requests
    and creates User and Item objects and sends them to the database as
    well as retrieving info from the db.
*/

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static('public_html'));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('json spaces', 2);


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/tutorqueue';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;



/*
    Handles GET request from the browser to log in a user.
*/
app.get('/login/:username/:password',
    function (req, res) {
        var user = req.params.username;
        var pass = req.params.password;
        User.findOne({ username: user }, (err, result) => {
            console.log(result);
            if (err) res.end(err);
            if (result && result.password == pass) {
                addSession(user);
                res.cookie('login', {username: user}, {maxAge: 300000});
                res.end('LOGIN');
            } else {
                res.end();
            }
        });
    }
);

/*
    Handles POST request from the browser to add a new user to the database.
*/
app.post('/add/user',
    function (req, res) {
        console.log(req.body);
        var user = new User({
            username: req.body.username,
            password: req.body.password,
            listings: [],
            purchases: []
        });
        user.save((err) => {
            if (err) res.end(err);
            res.end('SAVED');
        });
        res.end();
    }
);


app.listen(port, () => console.log('Node.js web server at port ' + port + ' is running..'));

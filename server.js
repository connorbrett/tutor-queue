/*
    Connor Brett
    This file is the server for the final project. It receives AJAX requests
    and creates User and Item objects and sends them to the database as
    well as retrieving info from the db.
*/

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const availabilitySchedule = require('availability-schedule');

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

var TutorRequestSchema = new Schema({
    name: String,
    email: String,
    course: String,
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
    submitted: Date
});

var TutorSchema = new Schema({
    name: String,
    email: String,
    courses: [String],
    availability: Mixed
});

var TutorRequest = mongoose.model('TutorRequest', TutorRequestSchema);
var Tutor = mongoose.model('Tutor', TutorSchema);


/*
    Handles GET request from the browser to log in a user.
*/
app.get('/queue',
    function (req, res) {
        TutorRequest.findMany({ tutor: { $ne: null } }, (err, result) => {
            console.log(result);
            if (err) res.end(err);
        });
    }
);

/*
    Handles POST request from the browser to add a new user to the database.
*/
app.post('/add/request',
    function (req, res) {
        console.log(req.body);
        var tutorRequest = new TutorRequest({
            name: req.body.name,
            email: req.body.email,
            course: req.body.courses,
            submitted: new Date()
        });
        tutorRequest.save((err) => {
            if (err) res.end(err);
            res.end('SAVED');
        });
        res.end();
    }
);

/*
    Handles POST request from the browser to add a new user to the database.
*/
app.post('/add/tutor',
    function (req, res) {
        console.log(req.body);

        var testAvailibility = new availabilitySchedule();
        var now = new Date();
        var later = new Date();
        later.setHours(now.getHours() + 2);
        testAvailibility.addAvailability(now, later);
        var tutor = new Tutor({
            name: req.body.name,
            email: req.body.email,
            courses: req.body.courses,
            availability: testAvailibility
        });
        tutor.save((err) => {
            if (err) res.end(err);
            res.end('SAVED');
        });
        res.end();
    }
);


app.listen(port, () => console.log('Node.js web server at port ' + port + ' is running..'));

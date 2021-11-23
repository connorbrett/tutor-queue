/*
    Connor Brett
    This file is the server for the final project. It receives AJAX requests
    and creates User and Item objects and sends them to the database as
    well as retrieving info from the db.
*/

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const availabilitySchedule = require('availability-schedule');

const app = express();
const port = 3000;

app.use(express.static('public_html'));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('json spaces', 2);

const WAITING = 'WAITING';
const INPROGRESS = 'IN PROGRESS';
const COMPLETE = 'COMPLETE';

var sessions = {};
const LOGIN_TIME = 60000;

function filterSessions() {
    var now = Date.now();
    for (x in sessions) {
        username = x;
        time = sessions[x];
        if (time + LOGIN_TIME < now) {
            console.log('delete user session: ' + username);
            delete sessions[username];
        }
    }
}

function addSession(username) {
    var now = Date.now();
    sessions[username] = now;
    console.log(sessions);
}

function hasSession(username) {
    return username in sessions;
}

setInterval(filterSessions, 2000);

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
    status: String,
    submitted: Date
});

var TutorSchema = new Schema({
    name: String,
    email: String,
    password: String,
    courses: [String],
    availability: Schema.Types.Mixed,
    busy: Boolean
});

var TutorRequest = mongoose.model('TutorRequest', TutorRequestSchema);
var Tutor = mongoose.model('Tutor', TutorSchema);

app.use(express.static('public_html'));
app.get('/', (req, res) => {
    console.log('redirect');
    res.redirect('/home.html');
});

// This is a special function to authenticate the user for some routes

function authenticate(req, res, next) {
    var c = req.cookies;
    if (c && c.login) {
        var username = c.login.username;
        if (hasSession(username)) {
            console.log('authenticating success!')
            addSession(username);
            next();
        } else {
            res.redirect('/index.html');
        }
    } else {
        res.redirect('/index.html');
    }
}

/*
    Handles POST request from the browser to log in a user.
*/
app.post('/login/user',
    function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        Tutor.findOne({ email: username }, (err, result) => {
            if (err) res.end(err);
            if (result && result.password == password) {
                addSession(username);
                res.cookie('login', { username: username }, { maxAge: 120000 });
                res.end('SUCCESS!');
            } else {
                res.end();
            }
        });
    });

/*
    Handles GET request from the browser return the current queue.
*/
app.get('/get/queue',
    function (req, res) {
        TutorRequest.find({ status: WAITING }, (err, results) => {
            if (err) res.end(err);
            res.json(results);
        });
    }
);

/*
    Handles GET request from the browser return the entire queue.
*/
app.get('/get/queue/all',
    function (req, res) {
        TutorRequest.find({}, (err, results) => {
            if (err) res.end(err);
            res.json(results);
        });
    }
);

/*
    Handles GET request from the browser to get all tutors.
*/
app.get('/get/tutors',
    function (req, res) {
        Tutor.find({}, (err, result) => {
            if (err) res.end(err);
            res.json(result);
        });
    }
);

/*
    Handles POST request from the browser to add a new user to the database.
*/
app.post('/add/request',
    function (req, res) {
        TutorRequest.findOne({ email: req.body.email, status: { $ne: 'COMPLETE' } },
            (err, student) => {
                if (err) res.err(err);
                if (student) {
                    res.end(`${student.name} already in queue.`);
                } else {
                    var tutorRequest = new TutorRequest({
                        name: req.body.name,
                        email: req.body.email,
                        course: req.body.courses,
                        status: WAITING,
                        submitted: new Date()
                    });
                    tutorRequest.save((err) => {
                        if (err) res.end(err);
                        res.end(`${req.body.name} added to queue.`);
                    });
                }
            });
    }
);

/*
    Handles POST request from the browser to complete a tutor request
*/
app.post('/complete/request',
    function (req, res) {
        var tutorEmail = req.body.tutorEmail;
        var studentEmail = req.body.studentEmail;
        Tutor.findOneAndUpdate(
            { email: tutorEmail, busy: true },
            { busy: false },
            (err, tutor) => {
                if (err) res.end(err);
                TutorRequest.findOneAndUpdate(
                    { email: studentEmail, status: INPROGRESS },
                    { status: COMPLETE },
                    (err, student) => {
                        if (err) res.end(err);
                        if (!student) {
                            res.end(`Did not complete request, ${student.name}'s request not found.`);
                        }
                        res.end(`${student.name} request completed by ${tutor.name}`);
                    }
                );
            }
        );
    }
);

/*
    Handles POST request from the browser to add a new tutor to the database.
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
            password: req.body.password,
            courses: req.body.courses,
            availability: testAvailibility,
            busy: false
        });
        tutor.save((err) => {
            if (err) res.end(err);
            res.end('Tutor added');
        });
    }
);

/*
    Handles POST request from the browser to assign a tutor to a student
*/
app.post('/assign',
    function (req, res) {
        var tutorEmail = req.body.tutorEmail;
        var studentEmail = req.body.studentEmail;
        console.log(`assigning ${tutorEmail} to ${studentEmail}`);
        Tutor.findOne({ email: tutorEmail }, (err, tutor) => {
            console.log('hi');
            console.log(tutor);
            if (err) res.end(err);
            if (!tutor) {
                res.end('Tutor not found');
            }
            if (tutor.busy) {
                res.end(`Tutor ${tutor.name} busy, cannot help more than one student at a time.`);
            }
            var tutorID = tutor.id;

            TutorRequest.findOneAndUpdate(
                { email: studentEmail, status: WAITING },
                {
                    tutor: tutorID,
                    status: INPROGRESS
                },
                (err, request) => {
                    if (err) res.end(err);
                    if (!request) {
                        res.end(`${studentEmail} not found, ${tutorEmail} was not assigned`);
                    }
                    Tutor.findByIdAndUpdate(tutorID, { busy: true }, (err, result) => {
                        res.end(`${tutorEmail} assigned to ${studentEmail}`);
                    });
                });
        });
    }
);

/*
    Test route to clear queue
*/
app.delete('/delete/queue',
    function (req, res) {
        TutorRequest.deleteMany({}).exec((err, results) => {
            console.log('Deleted users');
            res.end('Deleted users');
        });
    }
);

/*
    Test route to clear list of tutors
*/
app.delete('/delete/tutor',
    function (req, res) {
        var email = req.body.email;
        Tutor.deleteOne({ email: email }).exec((err, results) => {
            console.log('Deleted tutor');
            res.end('Deleted tutor');
        });
    }
);


app.listen(port, () => console.log('Node.js web server at port ' + port + ' is running..'));

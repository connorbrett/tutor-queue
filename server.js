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
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(express.static('public_html'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('json spaces', 2);

const WAITING = 'WAITING';
const INPROGRESS = 'IN PROGRESS';
const COMPLETE = 'COMPLETE';

/** SESSION CODE **/

TIMEOUT = 600000;
var sessions = {};
var coordSessions = {};

function filterSessions() {
    let now = Date.now();
    for (e in sessions) {
        if (sessions[e].time < (now - TIMEOUT)) {
            delete sessions[e];
        }
    }
}

function filterCoordSessions() {
    let now = Date.now();
    for (e in coordSessions) {
        if (coordSessions[e].time < (now - TIMEOUT)) {
            delete coordSessions[e];
        }
    }
}

setInterval(filterSessions, 2000);
setInterval(filterCoordSessions, 2000);

function putSession(username, sessionKey) {
    if (username in sessions) {
        sessions[username] = { 'key': sessionKey, 'time': Date.now() };
        return sessionKey;
    } else {
        let sessionKey = Math.floor(Math.random() * 1000);
        sessions[username] = { 'key': sessionKey, 'time': Date.now() };
        return sessionKey;
    }
}

function putCoordSession(username, sessionKey) {
    if (username in coordSessions) {
        coordSessions[username] = { 'key': sessionKey, 'time': Date.now() };
        return sessionKey;
    } else {
        let sessionKey = Math.floor(Math.random() * 1000);
        coordSessions[username] = { 'key': sessionKey, 'time': Date.now() };
        return sessionKey;
    }
}

function isValidSession(username, sessionKey) {
    if (username in sessions && sessions[username].key == sessionKey) {
        return true;
    }
    return false;
}

function isValidCoordSession(username, sessionKey) {
    if (username in coordSessions && coordSessions[username].key == sessionKey) {
        return true;
    }
    return false;
}

/** END SESSION CODE **/

/** HASHING CODE **/

function getHash(password, salt) {
    var cryptoHash = crypto.createHash('sha512');
    var toHash = password + salt;
    var hash = cryptoHash.update(toHash, 'utf-8').digest('hex');
    return hash;

}

function isPasswordCorrect(account, password) {
    var hash = getHash(password, account.salt);
    return account.hash == hash;
}

/** END HASHING CODE **/

//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/tutorqueue';
const mongoDB = 'mongodb+srv://hungleba3008:8647063pP@cluster0.x0ctu.mongodb.net/local_library?retryWrites=true&w=majority';
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
    description: String,
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
    status: String,
    submitted: Date
});

var TutorSchema = new Schema({
    name: String,
    email: String,
    hash: String,
    salt: String,
    courses: [String],
    availability: Schema.Types.Mixed,
    busy: Boolean
});

var CoordSchema = new Schema({
    email: String,
    hash: String,
    salt: String
});

var TutorRequest = mongoose.model('TutorRequest', TutorRequestSchema);
var Tutor = mongoose.model('Tutor', TutorSchema);
var Coord = mongoose.model('Coord', CoordSchema);

//app.use('/get/queue', authenticate);
//app.use('/add/tutor', authenticateCoord);
app.use(express.static('public_html'));


// This is a special function to authenticate tutors
function authenticate(req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
        let u = req.cookies.login.username;
        let key = req.cookies.login.key;
        if (isValidSession(u, key)) {
            putSession(u, key);
            res.cookie("login", { username: u, key: key }, { maxAge: TIMEOUT });
            next();
        } else {
            res.redirect('index.html');
        }
    } else {
        res.redirect('index.html');
    }
}

// This is a special function to authenticate coords
function authenticateCoord(req, res, next) {
    if (Object.keys(req.cookies).length > 0) {
        let u = req.cookies.login.username;
        let key = req.cookies.login.key;
        if (isValidCoordSession(u, key)) {
            putCoordSession(u, key);
            res.cookie("login", { username: u, key: key }, { maxAge: TIMEOUT });
            next();
        } else {
            res.redirect('index.html');
        }
    } else {
        res.redirect('index.html');
    }
}

/*
    Handles POST request from the browser to log in a tutor.
*/
app.post('/login/user',
    function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        Tutor.findOne({ email: username }, (err, result) => {
            if (err) res.end(err);
            if (result && isPasswordCorrect(result, password)) {
                var sessionKey = putSession(req.params.username);
                res.cookie("login", { username: req.params.username, key: sessionKey }, { maxAge: TIMEOUT });
                res.end('SUCCESS!');
            } else {
                res.end('There was an issue logging in please try again');
            }
        });
    }
);

/*
    Handles POST request from the browser to log in a coordinator.
*/
app.post('/login/coord',
    function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        Coord.findOne({ email: username }, (err, result) => {
            if (err) res.end(err);
            if (result && isPasswordCorrect(result, password)) {
                var sessionKey = putCoordSession(req.params.username);
                res.cookie("login", { username: req.params.username, key: sessionKey }, { maxAge: TIMEOUT });
                res.end('SUCCESS!');
            } else {
                res.end('There was an issue logging in please try again');
            }
        });
    }
);

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
    Handles GET request from the browser to get all coordinators.
*/
app.get('/get/coords',
    function (req, res) {
        Coord.find({}, (err, result) => {
            if (err) res.end(err);
            res.json(result);
        });
    }
);

/*
    Handles GET request from the browser to get tutor's current student.
*/
app.get('/get/request/:tutor',
    function (req, res) {
        var tutorEmail = req.params.tutor;
        Tutor.findOne({ email: tutorEmail }, (err, tutor) => {
            if (err) res.end(err);
            TutorRequest.find(
                { tutor: tutor.id, status: INPROGRESS },
                (err, request) => {
                    if (err) res.end(err);
                    res.json(request);
                }
            );
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
                        course: req.body.course,
                        description: req.body.description,
                        status: WAITING,
                        submitted: new Date()
                    });
                    tutorRequest.save((err) => {
                        if (err) res.end(err);
                        res.end(`${req.body.name} added to queue!`);
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
        var testAvailibility = new availabilitySchedule();

        var salt = Math.floor(Math.random() * 1000000000000);
        var hash = getHash(req.body.password, salt);

        var tutor = new Tutor({
            name: req.body.name,
            email: req.body.email,
            hash: hash,
            salt: salt,
            courses: req.body.courses,
            availability: testAvailibility,
            busy: false
        });
        Tutor.find({ email: req.body.email }, (err, result) => {
            console.log(result);
            if (!err && result.length == 0) {
                tutor.save((err) => {
                    if (err) res.end(err);
                    res.end('Tutor added');
                });
            } else {
                res.end('Tutor already exists');
            }
        });
    }
);

/*
    Handles POST request from the browser to add a new coordinator to the database.
*/
app.post('/add/coord',
    function (req, res) {
        var salt = Math.floor(Math.random() * 1000000000000);
        var hash = getHash(req.body.password, salt);

        var coord = new Coord({
            email: req.body.email,
            hash: hash,
            salt: salt,
        });
        Coord.find({ email: req.body.email }, (err, result) => {
            if (!err && result.length == 0) {
                coord.save((err) => {
                    if (err) res.end(err);
                    res.end('Coordinator added');
                });
            } else {
                res.end('Coordinator already exists');
            }
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
        Tutor.findOne({ email: tutorEmail }, (err, tutor) => {
            console.log(tutor);
            if (err) res.end(err);
            if (!tutor) {
                res.end('Tutor not found');
                return;
            }
            if (tutor.busy) {
                res.end(`Tutor ${tutor.name} busy, cannot help more than one student at a time.`);
                return;
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

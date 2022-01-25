/*
    Author: Hung & Connor
    Purpose: Trying to display the schedule if the user is still
        valid. Redirects to the login page otherwise.
*/
window.onload = isLoggedIn;
const requiredCourses = ['CSC 101', 'CSC 110', 'CSC 120', 'CSC 210'];

$(document).ready(displaySchedule);

// Instantly redirect to /index.html if the user is not logged in
function isLoggedIn() {
    $.ajax({
        url: '/coords/tutors',
        method: 'GET',
        success: function (tutors) {
            // Session time out
            if (tutors === 'redirect') {
                window.location.replace("/index.html");
                return;
            }
        }
    });
}

// Return the tutor's email
function getTutorEmail() {
    return localStorage.getItem('email');
}

// This function gets the tutor schedule then display it
function displaySchedule() {
    $.ajax({
        url: '/tutorSchedule',
        method: 'GET',
        success: function (result) {
            // Session time out
            if (result === 'redirect') {
                window.location.replace("/index.html");
                return;
            }
            // Else, display the schedule
            $("#tutorSchedule").attr("src", result);
        }
    });
    $.ajax({
        url: '/coordSchedule',
        method: 'GET',
        success: function (result) {
            // Session time out
            if (result === 'redirect') {
                window.location.replace("/index.html");
                return;
            }
            // Else, display the schedule
            $("#coordSchedule").attr("src", result);
        }
    });
}

/*  Add a new tutor to the database
 */
function addTutor() {
    var courses = getSelectedCourses();
    if (!validateCourses(courses)) {
        alert('Courses through 210 are required at minimum.');
        return;
    }
    var accountInfo = {
        name: $("#name").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        courses: courses
    };
    $.ajax({
        url: '/coords/tutors/add',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            // Session time out
            if (result === 'redirect') {
                window.location.replace("/index.html");
                return;
            }
            // Otherwise, add a new tutor
            if (result == 'Tutor added') {
                alert("New tutor added!");
                $('#newTutor').trigger('reset');
            } else {
                alert("Something went wrong, failed to add new tutor!");
            }
        }
    });
}

function getSelectedCourses() {
    return $('input:checked').map(function () {
        return this.value;
    }).get();
}

function validateCourses(courses) {
    var courses = getSelectedCourses();
    return requiredCourses.every(function(item) {
        return courses.indexOf(item) !== -1;
     });
}
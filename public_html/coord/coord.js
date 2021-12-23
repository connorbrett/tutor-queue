/*
    Author: Hung & Connor
    Purpose: Trying to display the schedule if the user is still
        valid. Redirects to the login page otherwise.
*/

window.onload = onloadFunc;
const requiredCourses = ['CSC 101', 'CSC 110', 'CSC 120', 'CSC 210'];

// Authenticate the coordinator. In case invalid, redirects to the login page.
function onloadFunc() {
    displaySchedule();
    $('#loggedInEmail').html(getTutorEmail());
}

// Return the tutor's email
function getTutorEmail() {
    return localStorage.getItem('email');
}

// This function gets the tutor schedule then display it
function displaySchedule() {
    $.ajax({
        url: '/get/schedule',
        method: 'GET',
        success: function (result) {
            // Session time out
            if (result === 'redirect') {
                window.location.replace("/coord/coordLogin.html");
                return;
            }
            // Else, display the schedule
            $("iframe").attr("src", result);
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
        url: '/add/tutor',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            // Session time out
            if (result === 'redirect') {
                window.location.replace("/coord/coordLogin.html");
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
/*
    Author: Hung & Connor
    Purpose: This js file responsible for rendering the queues or
        redirects the tutor if his/her session timed out.
    There are some global variables which serve for the
        icon notifications. Its usage is described in the comments.
*/

var waitingNum = 0; // Number of waiting sutdents
var id = 0; // id for students in the queue (including both waiting and in-progress)
var title = document.title; 
var iconNew = '/images/icon/noti-favicon.ico' // path to noti-favicon
$(document).ready(onloadFunc);
$(document).ready(updateEmail);
setInterval(onloadFunc, 5000);

/*
    This function finds out the number of waiting
        students in the queue and changes the page
        title accordingly.
    *Note: It also changes the favicon
*/
function changeTitle() {
    if (waitingNum > 0) {
        var newTitle = `(${waitingNum}) ${title}`;
        document.title = newTitle;
        changeFavicon();
    }
}

// Change favicon if there are student await
function changeFavicon() {
    $("#favicon").attr("href", iconNew);
}

// Reload the page for updated information
function reloadSite() {
    location.reload();
}

/*
    Display waiting student queue and in-progress
        student queue whenever the page is loaded.
        Also, reload the page every 10 seconds.
*/
function onloadFunc() {
    getWaitingQueue();
    getInProgressQueue();
}

function updateEmail() {
    $('#loggedInEmail').html(getTutorEmail());
}

// Return the tutor's email
function getTutorEmail() {
    return localStorage.getItem('email');
}

// Rendering student waiting queue.
function getWaitingQueue() {
    $.ajax({
        url: '/queue',
        method: 'GET',
        success: function (students) {
            $("tbody#waiting").html('');
            if (students === "redirect") {
                window.location.replace("/index.html");
                return;
            }
            for (let i = 0; i < students.length; i++) {
                student = students[i];
                var time = getReadableTime(student.submitted);
                $("tbody#waiting").append(`<tr id=student${id}></tr>`);
                $(`#student${id}`).append(`<td>${time}</td>`);
                $(`#student${id}`).append(`<td>${student.name}</td>`);
                $(`#student${id}`).append(`<td>${student.email}</td>`);
                $(`#student${id}`).append(`<td>${student.course}</td>`);
                $(`#student${id}`).append(`<td>${student.description}</td>`);
                $(`#student${id}`).append(`<td><button onclick="assign('${student.email}')">WAITING</button></td>`);
                id++;
            }
            waitingNum = students.length;
            changeTitle();
        }
    });
}

// Assign a student to the current logged in tutor. Change
//  the student from waiting queue to in-progress queue.
function assign(studentEmail) {
    tutorEmail = getTutorEmail()
    if (!tutorEmail) {
        return;
    }
    var requestInfo = {
        studentEmail: studentEmail,
        tutorEmail: tutorEmail
    };
    $.ajax({
        url: '/request/assign',
        data: requestInfo,
        method: 'POST',
        success: function (result) {
            if (result === "redirect") {
                window.location.replace("/index.html");
                return;
            }
            alert(result);
            location.reload();
        }
    });
}

// Render in-progress student queue
function getInProgressQueue() {
    tutorEmail = getTutorEmail()
    if (!tutorEmail) {
        return;
    }
    $.ajax({
        url: `/request/${encodeURIComponent(tutorEmail)}`,
        method: 'GET',
        success: function (students) {
            $("tbody#in-progress").html('');
            if (students === "redirect") {
                window.location.replace("/index.html");
                return;
            }
            for (let i = 0; i < students.length; i++) {
                student = students[i];
                var time = getReadableTime(student.submitted);
                $("tbody#in-progress").append(`<tr id=student${id}></tr>`);
                $(`#student${id}`).append(`<td>${time}</td>`);
                $(`#student${id}`).append(`<td>${student.name}</td>`);
                $(`#student${id}`).append(`<td>${student.email}</td>`);
                $(`#student${id}`).append(`<td>${student.course}</td>`);
                $(`#student${id}`).append(`<td>${student.description}</td>`);
                $(`#student${id}`).append(`<td><button onclick="done('${student.email}')">DONE</button></td>`);
                id++;
            }
        }
    });
}

// Change tutor's status back to free and remove the student from the queue.
function done(studentEmail) {
    tutorEmail = getTutorEmail()
    if (!tutorEmail) {
        return;
    }
    var requestInfo = {
        studentEmail: studentEmail,
        tutorEmail: tutorEmail
    };
    $.ajax({
        url: '/request/complete',
        data: requestInfo,
        method: 'POST',
        success: function (result) {
            if (result === "redirect") {
                window.location.replace("/index.html");
                return;
            }
            alert(result);
            location.reload();
        }
    });
}

function getReadableTime(submittedDate) {
    var dateObj = new Date(submittedDate);
    var date = dateObj.toLocaleDateString();
    var hour = '';
    var minute = '';
    var period = 'AM';
    if (dateObj.getHours() > 12) {
        hour = " 0" + (dateObj.getHours() - 12).toString();
        period = 'PM';
    } else {
        hour = " " + dateObj.getHours();
    }
    if (dateObj.getMinutes() < 10) {
        minute = '0' + dateObj.getMinutes();
    } else {
        minute = dateObj.getMinutes();
    }
    return `${date} ${hour}:${minute} ${period}`;
}
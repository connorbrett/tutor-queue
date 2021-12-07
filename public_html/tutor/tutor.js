var waitingNum = 0; // Number of waiting sutdents
var id = 0; // id for students in the queue (including both waiting and in-progress)
var title = document.title; 
var iconNew = '/images/icon/noti-favicon.ico' // path to noti-favicon
window.onload = onloadFunc;
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

// Return the tutor's email
function getTutorEmail() {
    return localStorage.getItem('email');
}

// Rendering student waiting queue.
function getWaitingQueue() {
    $.ajax({
        url: '/get/queue',
        method: 'GET',
        success: function (students) {
            $("tbody#waiting").html('');
            for (let i = 0; i < students.length; i++) {
                student = students[i];
                $("tbody#waiting").append(`<tr id=student${id}></tr>`);
                $(`#student${id}`).append("<td>" + student.name + "</td>");
                $(`#student${id}`).append("<td>" + student.email + "</td>");
                $(`#student${id}`).append("<td>" + student.course + "</td>");
                $(`#student${id}`).append("<td>" + student.description + "</td>");
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
        url: '/assign',
        data: requestInfo,
        method: 'POST',
        success: function (result) {
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
        url: `/get/request/${tutorEmail}`,
        method: 'GET',
        success: function (students) {
            $("tbody#in-progress").html('');
            for (let i = 0; i < students.length; i++) {
                student = students[i];
                $("tbody#in-progress").append(`<tr id=student${id}></tr>`);
                $(`#student${id}`).append("<td>" + student.name + "</td>");
                $(`#student${id}`).append("<td>" + student.email + "</td>");
                $(`#student${id}`).append("<td>" + student.course + "</td>");
                $(`#student${id}`).append("<td>" + student.description + "</td>");
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
        url: '/complete/request',
        data: requestInfo,
        method: 'POST',
        success: function (result) {
            alert(result);
            location.reload();
        }
    });
}

// An attemp to get updated information without having to relaod the page.
// function reloadContent() {
//     // don't cache ajax or content won't be fresh
//     $.ajaxSetup ({
//         cache: false
//     });
//     var ajax_load = "<img src='http://automobiles.honda.com/images/current-offers/small-loading.gif' alt='loading...' />";

//     // load() functions
//     var loadUrl = "/tutor/tutor.html";
//     $("body").html(ajax_load).load(loadUrl);

// // end  
// };
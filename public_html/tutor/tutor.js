var waitingNum = 0;
var id = 0;
var title = document.title;
var iconNew = '/images/icon/noti-favicon.ico'
window.onload = onloadFunc;

function changeTitle() {
    if (waitingNum > 0) {
        var newTitle = `(${waitingNum}) ${title}`;
        document.title = newTitle;
        changeFavicon();
    }
}

function changeFavicon() {
    $("#favicon").attr("href", iconNew);
}

function reloadSite() {
    location.reload();
}

function onloadFunc() {
    getWaitingQueue();
    getInProgressQueue();
    setInterval(reloadSite, 10000);
}

function getTutorEmail() {
    return localStorage.getItem('email');
}

function getWaitingQueue() {
    $.ajax({
        url: '/get/queue',
        method: 'GET',
        success: function (students) {
            for (let i = 0; i < students.length; i++) {
                student = students[i];
                $("tbody#waiting").append(`<tr id=student${id}></tr>`);
                $(`#student${id}`).append("<td>" + student.name + "</td>");
                $(`#student${id}`).append("<td>" + student.email + "</td>");
                $(`#student${id}`).append("<td>" + student.course + "</td>");
                $(`#student${id}`).append(`<td><button onclick="assign('${student.email}')">WAITING</button></td>`);
                id++;
            }
            waitingNum = students.length;
            changeTitle();
        }
    });
}

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

function getInProgressQueue() {
    tutorEmail = getTutorEmail()
    if (!tutorEmail) {
        return;
    }
    $.ajax({
        url: `/get/request/${tutorEmail}`,
        method: 'GET',
        success: function (students) {
            for (let i = 0; i < students.length; i++) {
                student = students[i];
                $("tbody#in-progress").append(`<tr id=student${id}></tr>`);
                $(`#student${id}`).append("<td>" + student.name + "</td>");
                $(`#student${id}`).append("<td>" + student.email + "</td>");
                $(`#student${id}`).append("<td>" + student.course + "</td>");
                $(`#student${id}`).append(`<td><button onclick="done('${student.email}')">DONE</button></td>`);
                id++;
            }
        }
    });
}

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
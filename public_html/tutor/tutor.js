window.onload = onloadFunc;
var id = 0;

function onloadFunc() {
    getWaitingQueue();
    getInProgressQueue();
}

function getTutorEmail() {
    if (document.cookie) {
        return decodeURIComponent(document.cookie).split(":\"")[1].slice(0, -2);
    } else {
        alert("Session timeout, pleases login again!");
        window.location.replace("/index.html");
    }
}

function getWaitingQueue() {
    $.ajax({
        url: '/get/queue',
        method: 'GET',
        success: function (students) {
            for (let i=0; i < students.length; i++) {
                student = students[i];
                $("tbody#waiting").append(`<tr id=student${id}></tr>`); 
                $(`#student${id}`).append("<td>"+student.name+"</td>"); 
                $(`#student${id}`).append("<td>"+student.email+"</td>"); 
                $(`#student${id}`).append("<td>"+student.course+"</td>"); 
                $(`#student${id}`).append(`<td><button onclick="assign('${student.email}')">WAITING</button></td>`);
                id++; 
            }
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
            for (let i=0; i < students.length; i++) {
                student = students[i];
                $("tbody#in-progress").append(`<tr id=student${id}></tr>`); 
                $(`#student${id}`).append("<td>"+student.name+"</td>"); 
                $(`#student${id}`).append("<td>"+student.email+"</td>"); 
                $(`#student${id}`).append("<td>"+student.course+"</td>"); 
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
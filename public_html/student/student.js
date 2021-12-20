/*
    Author: Hung & Connor
    Purpose: This js file is responsible for checking blank input
        and redirects to a confirmation page if the request is
        sent successfully.
*/

window.onload = getPlaceInQueue;
setInterval(getPlaceInQueue, 5000);

/* Check blank input */
function isValidInput() {
    let name = $("#name").val();
    let email = $("#email").val();
    let course = $("#course").val();
    if (name === "" || email === "" || course === "") {
        return false;
    }
    return true;
}

/* Submit student's request */
function sendRequest() {
    if (!isValidInput()) {
        alert("Name, Email, and Course must not be empty");
        return;
    }
    var requestInfo = {
        name: $("#name").val(),
        email: $("#email").val(),
        course: $("#course").val(),
        description: $("#description").val()
    };
    $.ajax({
        url: '/add/request',
        data: requestInfo,
        method: 'POST',
        success: function (result) {
            if (result.slice(-1) === "!") {
                localStorage.setItem('studentEmail', $("#email").val());
                window.location.replace("/student/studentDone.html");
            } else {
                alert(result);
            }
        }
    });
}

// Return the tutor's email
function getStudentEmail() {
    return localStorage.getItem('studentEmail');
}

function getPlaceInQueue() {
    $.ajax({
        url: '/get/queue/place/' + encodeURIComponent(getStudentEmail()),
        method: 'GET',
        success: function (result) {
            if (result !== 'ERROR') {
                $('#placeInQueue').html(result);
            }
        }
    });
}
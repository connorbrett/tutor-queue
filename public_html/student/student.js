/*
    Author: Hung & Connor
    Purpose: This js file is responsible for checking blank input
        and redirects to a confirmation page if the request is
        sent successfully.
*/

/* Check blank input */
function isValidInput() {
    let name = $("#name").val();
    let email = $("#email").val();
    let course = getSelectedCourse();
    if (name === "" || email === "" || !course) {
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
        course: getSelectedCourse(),
        description: $("#description").val()
    };
    console.log('hi')
    $.ajax({
        url: '/student/request/add',
        data: requestInfo,
        method: 'POST',
        success: function (result) {
            if (result !== 'ERROR') {
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

function getSelectedCourse() {
    // Get checked radio button
    var course = $('input[type=radio][name=course]:checked').val();
    if (course === 'other') {
        course = $('#otherCourse').val();
    }
    return course;
}
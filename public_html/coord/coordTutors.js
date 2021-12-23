/*
    Author: Hung & Connor
    Purpose: Trying to display the schedule if the user is still
        valid. Redirects to the login page otherwise.
*/

window.onload = showTutors;

// Return the tutor's email
function getTutorEmail() {
    return localStorage.getItem('email');
}

function showTutors() {
    $.ajax({
        url: '/get/tutors',
        method: 'GET',
        success: function (tutors) {
            // Session time out
            if (tutors === 'redirect') {
                window.location.replace("/coord/coordLogin.html");
                return;
            }
            // Otherwise, show all tutors
            for (let i = 0; i < tutors.length; i++) {
                tutor = tutors[i];
                $("tbody#tutors").append(`<tr id=tutor${i}></tr>`);
                $(`#tutor${i}`).append(`<td>${tutor.name}</td>`);
                $(`#tutor${i}`).append(`<td>${tutor.email}</td>`);

                $(`#tutor${i}`).append(`<td>${tutor.courses}</td>`);
            }
        }
    });
}
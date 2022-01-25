/*
    Author: Connor
    Purpose: 
*/

$(document).ready(loadNavBar);

// Return the tutor's email
function getTutorEmail() {
    return localStorage.getItem('email');
}

function loadNavBar() {
    $.ajax({
        url: '/coords/check/' + encodeURIComponent(getTutorEmail()),
        method: 'GET',
        success: function (result) {
            var title = '';
            if (result === 'true') {
                $('#extraLinks').append(`<a href="../tutor/tutor.html" class="links">Tutor Queue</a>`);
                $('#extraLinks').append(`<a href="../coord/coordTutors.html" class="links">Tutor Information</a>`);
                $('#extraLinks').append(`<a href="../coord/coordSchedule.html" class="links">Schedule</a>`);
                $('#extraLinks').append(`<a href="../coord/coordAddTutor.html" class="links">Add Tutor</a>`);
                
                title = ' - Coordinator';
            } else {
                title = ' - Tutor'
            }
            $('#loggedInEmail').html(getTutorEmail() + title);
        }
    });
}

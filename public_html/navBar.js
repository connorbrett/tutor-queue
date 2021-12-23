/*
    Author: Connor
    Purpose: 
*/

window.onload = loadNavBar;

// Return the tutor's email
function getTutorEmail() {
    return localStorage.getItem('email');
}

function loadNavBar() {
    $('#loggedInEmail').html(getTutorEmail());
    $.ajax({
        url: '/coord/check/' + encodeURIComponent(getTutorEmail()),
        method: 'GET',
        success: function (result) {
            if (result === 'true') {
                $('#extraLinks').append(`<a href="../coord/coordTutors.html" class="links">Tutor Information</a>`);
                $('#extraLinks').append(`<a href="../tutor/tutor.html" class="links">Tutor Queue</a>`);
            }
        }
    });
}

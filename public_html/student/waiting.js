/*
    Author: Connor
    Purpose: Update the queue number for students waiting
*/

$(document).ready(getPlaceInQueue);
setInterval(getPlaceInQueue, 5000);

function getPlaceInQueue() {
    $.ajax({
        url: '/student/queue/' + encodeURIComponent(getStudentEmail()),
        method: 'GET',
        success: function (result) {
            console.log(result);
            if (result !== 'ERROR') {
                $('#placeInQueue').html(result);
            }
        }
    });
}
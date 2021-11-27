/*  Add a new tutor to the database
 */
function addTutor() {
    var accountInfo = {
        name: $("#name").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        courses: $("#courses").val().split(/[ ,]+/) //Split by white space
    };
    $.ajax({
        url: '/add/tutor',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            if (result == 'Tutor added') {
                alert("New tutor added!")
            } else {
                alert("Something went wrong, failed to add new tutor!");
            }
        }
    });
}
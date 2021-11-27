/*  Add a new tutor to the database
*/
function toCoord() {
    var accountInfo = {
        username: $("#netID").val(),
        password: $("#password").val()
    };
    $.ajax({
        url: '/create/tutor',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            if (result == 'SUCCESS!') {
                alert("New tutor added!")
            } else {
                alert("Username or Password incorrect!");
            }
        }
    });
}
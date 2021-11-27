/*  Authenticate and login tutor.
Redirect if res.end returns SUCCESS!, alert otherwise 
*/
function toCoord() {
    var accountInfo = {
        username: $("#username").val(),
        password: $("#password").val()
    };
    $.ajax({
        url: '/login/coord',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            if (result == 'SUCCESS!') {
                window.location.href = "coord.html";
            } else {
                alert("Username or Password incorrect!");
            }
        }
    });
}
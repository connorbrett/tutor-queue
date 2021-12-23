/*
    Author: Hung & Connor
    Purpose: Authenticate and log the coordinator in. It can
        also creates a new coordinator account.
*/

/* 
    Authenticate and login tutor.
        Redirect if res.end returns SUCCESS!, alert otherwise 
*/
function toCoord() {
    var accountInfo = {
        username: $("#email").val(),
        password: $("#password").val()
    };
    $.ajax({
        url: '/login/coord',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            // Successfully logged in
            if (result == 'SUCCESS!') {
                localStorage.setItem('email', $("#email").val());
                window.location.href = "coord.html";
            } else {
                // Show alert if the account is invalud
                alert("Username or Password incorrect!");
            }
        }
    });
}

// Add a new coordinator account to the database.
function addCoord() {
    var accountInfo = {
        email: $("#newUsername").val(),
        password: $("#newPassword").val()
    };
    $.ajax({
        url: '/add/coord',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            alert(result);
        }
    });
}
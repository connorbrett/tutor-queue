// Popup a board for tutor login
function loginPopup() {
    document.getElementById("popup-1").classList.toggle("active");
}

// Redirect to student's webpage
function toStudent() {
    window.location.href = "student/student.html";
}

/*  Authenticate and login tutor.
    Redirect if res.end returns SUCCESS!, alert otherwise 
*/
function toTutor() {
    var accountInfo = {
        username: $("#netID").val(),
        password: $("#password").val()
    };
    $.ajax({
        url: '/login/user',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            if (result == 'SUCCESS!') {
                window.location.href = "tutor/tutor.html";
            } else {
                alert("Username or Password incorrect!");
            }
        }
    });
}
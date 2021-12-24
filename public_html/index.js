/*
    Author: Hung & Connor
    Purpose: This js file handles all interactions between the users
        and the server using AJAX. If the user is a:
        + student -> redirects to the request form page for students.
        + tutor -> shows popup login and redirects to the tutor queue.
        + coordinator -> redirects to the coordinator login page.
*/

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
        username: $("#email").val(),
        password: $("#password").val()
    };
    $.ajax({
        url: '/login/tutor',
        data: accountInfo,
        method: 'POST',
        success: function (result) {
            // Login successfully
            if (result == 'SUCCESS!') {
                localStorage.setItem('email', $("#email").val());
                window.location.href = "tutor/tutor.html";
            } else {
                alert("Username or Password incorrect!");
            }
        }
    });
}

// Redirect to coordinator login site
function toCoordLogin() {
    window.location.href = "coord/coordLogin.html";
}
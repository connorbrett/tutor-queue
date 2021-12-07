window.onload = onloadFunc;

// Authenticate the coordinator. In case invalid, redirect to the login page.
function onloadFunc() {
    displaySchedule();
}

// This function gets the tutor schedule then display it
function displaySchedule() {
    $.ajax({
        url: '/get/schedule',
        method: 'GET',
        success: function (result) {
            if (result === 'redirect') {
                window.location.replace("/coord/coordLogin.html");
                return;
            }
            $("iframe").attr("src", result);
        }
    });
}

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
            if (result === 'redirect') {
                window.location.replace("/coord/coordLogin.html");
                return;
            }
            if (result == 'Tutor added') {
                alert("New tutor added!")
            } else {
                alert("Something went wrong, failed to add new tutor!");
            }
        }
    });
}
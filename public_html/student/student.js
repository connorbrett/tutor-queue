/* Check blank input */
function isValidInput() {
    let name = $("#name").val();
    let email = $("#email").val();
    let course = $("#course").val();
    if (name === "" || email === "" || course === "") {
        return false;
    }
    return true;
}

/* Submit student's request */
function sendRequest() {
    if (!isValidInput()) {
        alert("Name, Email, and Course must not be empty");
        return;
    }
    var requestInfo = {
        name: $("#name").val(),
        email: $("#email").val(),
        course: $("#course").val()
    };
    $.ajax({
        url: '/add/request',
        data: requestInfo,
        method: 'POST',
        success: function (result) {
            if (result.slice(-1) === "!") {
                window.location.replace("/student/studentDone.html");
            } else {
                alert(result);
            }
        }
    });
}
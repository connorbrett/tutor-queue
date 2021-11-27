/* Submit student's request */
function sendRequest() {
    var requestInfo = {
        name: $("#name").val(),
        email: $("#email").val(),
        courses: $("#course").val()
    };
    $.ajax({
        url: '/add/request',
        data: requestInfo,
        method: 'POST',
        success: function (result) {
            alert(result);
        }
    });
}
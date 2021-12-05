$( function() {
    $(document).on('input', '#file-input', function (e) {
        let $fr = new FileReader();
        $fr.onload = function () {
            $('#user-image').attr('src', $fr.result);
        }
        $fr.readAsDataURL(this.files[0]);
    });
});
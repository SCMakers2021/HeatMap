$(function () {
    // ログインタブのバリデーション(入力値の妥当性チェック)
    $("#div-login-input").validate({
        // バリデーションルール
        rules: {
            login_email: {
                required: true,
                email: true,
            },
        },

        // エラーメッセージ
        messages: {
            login_email: {
                required: 'メールアドレスを入力してください',
                email: 'メールアドレスの形式で入力してください',
            },
        },
        // エラーメッセージ出力箇所
        errorPlacement: function (error, element) {
            error.appendTo($('.login-error-message'));
        },

        errorElement: "span",
        errorClass: "is-error",
    });

    // ログインタブのバリデーション(入力値の妥当性チェック)
    $("#div-signup-input").validate({
        // バリデーションルール
        rules: {
            signup_email: {
                required: true,
                email: true,
            },
        },

        // エラーメッセージ
        messages: {
            singup_email: {
                required: 'メールアドレスを入力してください',
                email: 'メールアドレスの形式で入力してください',
            },
        },
        // エラーメッセージ出力箇所
        errorPlacement: function (error, element) {
            error.appendTo($('.login-error-message'));
        },

        errorElement: "span",
        errorClass: "is-error",
    });
});
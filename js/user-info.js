$( function() {

    // カスタムバリデータ(ファイルサイズ)
    $.validator.addMethod('filesize', function (value, element, arg) {
        if (element.files[0] == null) {
            return true;
        }
        if(element.files[0].size<=arg){
            return true;
        }else{
            return false;
        }
    });

    // アイコンクリック→ファイル選択画面でOK時動くイベント
    $(document).on('input', '#file-input', function (e) {
        let $fr = new FileReader();
        $fr.onload = function () {
            $('#user_image').attr('src', $fr.result);
        };
        $fr.readAsDataURL(this.files[0]);
    });

    // 保存ボタン押下処理
    $( '#user-info-save' ).on( 'click', function() {
        console.log("保存処理開始")
        let isValid = $('#user_info_items').valid();
        if (!isValid) {
            console.log("バリデーションエラーのため、保存処理を中断します。");
            return false;
        }

        const file = $('#file-input').prop('files')[0];
        let userImageBASE64 = $('#user_image').attr('src');
        if ("./images/auth.png" == userImageBASE64) {
            userImageBASE64 = '';
        }
        const userName = $('input[name="user_name"]').val();
        const link = $('input[name="link"]').val();

        registerUserInfo(file,userImageBASE64,userName,link);
    });

    function registerUserInfo(file,userImageBASE64,userName,link) {

        // プルダウンからカテゴリを選択
        let userID = token.Sub;
        let iconInfoJSON = '';
        if ('' != userImageBASE64) {
            iconInfoJSON = dataUrlSplit(userImageBASE64, file);
        }
        let data = {
            function: "AddUserInfo",
            userID: userID,
            userName: userName,
            userLink: link,
            pic: iconInfoJSON
        };
        console.log(data);
        // instantiate a headers object
        let myHeaders = new Headers();
        // add content type header to object
        myHeaders.append("Content-Type", "application/json");
        // using built in JSON utility package turn object to string and store in a variable
        let ele = JSON.stringify({Element: data}, null, ' ');
        // create a JSON object with parameters for API call and store in a variable
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: ele,
            redirect: 'follow'
        };
        // make API call with parameters and use promises to get response
        fetch(HeatMapURL, requestOptions)
            .then(response => response.text())
            .then(result => {
                    //alert(JSON.parse(result).body)
                    alert("登録しました。");
                    readUserInfo(token.Sub);
                }
            )
            .catch(error => console.log('error', error));

    }

    // ユーザー情報登録画面のバリデーション(入力値の妥当性チェック)
    $("#user_info_items").validate({
        // バリデーションルール
        rules: {
            user_name: {
                required: true,
                maxlength:10,
            },
            link: {
                required: false,
                url : true,
            },
            my_file_input: {
                extension: "jpg|png|jpeg",
                filesize:512000,
            },
        },

        // エラーメッセージ
        messages: {
            user_name: {
                required: '\nユーザー名が未入力です',
                maxlength:'\nユーザー名の文字数が上限(10文字)を超えています',
            },
            link: {
                url : '\n不正なURL形式です'
            },
            my_file_input: {
                filesize:'\nファイルサイズが上限(500KB)を超えています。',
            }
        },
        // エラーメッセージ出力箇所
        errorPlacement: function (error, element) {
            error.appendTo($('.userinfo-error-message'));
        },

        errorElement: "span",
        errorClass: "is-error",
    });

});

function setUserInfo(result) {
    const data = JSON.parse(result);
    const body = data['body'];
    const userName = body['userName'];
    const userLink = body['userLink'];
    const iconPath = body['iconPath'];

    $("input[name='user_name']").val(userName);
    $("input[name='link']").val(userLink);
    if (iconPath != '') {
        $('#user_image').attr('src', iconPath);
        $('.userIcon').attr('src', iconPath);
    }
}

function readUserInfo(userID) {
    let data = {
        function: "ReadUserInfo",
        userID: userID,
    };
    // instantiate a headers object
    let myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    let ele = JSON.stringify({Element: data}, null, ' ');
    // create a JSON object with parameters for API call and store in a variable
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: ele,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch(HeatMapURL, requestOptions)
        .then(response => response.text())
        .then(result =>
            //alert(JSON.parse(result).body)
            setUserInfo(result)
        )
        .catch(error => console.log('error', error));
}
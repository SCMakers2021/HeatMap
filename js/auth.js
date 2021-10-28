// @ts-check
"use strict";
/* jshint esversion: 6, laxbreak: true, laxcomma: true, node: true, browser: true, devel: true */
/* globals $:false */

/**
 * Cognite からのトークン
 */
class Tokens {
	constructor(result) {
		this.idToken = result.getIdToken().getJwtToken();		  // IDトークン
		this.accessToken = result.getAccessToken().getJwtToken();  // アクセストークン
		this.refreshToken = result.getRefreshToken().getToken();   // 更新トークン
	}
	get IdToken() {
		return this.idToken;
	}
	get AccessToken() {
		return this.accessToken;
	}
	get RefreshToken() {
		return this.refreshToken;
	}
	get Sub() {
		let varSub = "";
		let value = this.idToken.split('.');
		if (3 == value.length) {
			let decoded = atob(value[1]);
			let valStr = decoded.substr(1, decoded.length -2);
			let valAry = valStr.split(',');
			for (let intCnt = 0; intCnt < valAry.length; intCnt++){
				let varParts = valAry[intCnt];
				let intRet = varParts.indexOf("sub");
				if (-1 != intRet){
					let varCut = varParts.split(':');
					varSub = varCut[1].substr(1, varCut[1].length -2);
				}
			}
		}
		return varSub;
	}
}

$( function() {
	// ユーザープールの設定
	const poolData = {
		UserPoolId : 'us-east-1_pSoBt4yhL',
		ClientId : '1b48a6toq62q2dirqr9ihqh01r'
	};
	const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	// Amazon Cognito 認証情報プロバイダーの初期化
	AWSCognito.config.region = 'us-east-1'; // リージョン
	AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-1:223d4d8c-f8ac-4836-b349-3f4eed02d17a'
	});

	/**
	 * サインイン
	 * @param {string} email メールアドレス
	 * @param {string} password パスワード
	 * @return {Promise} プロミス
	 */
	function signIn(email, password) {
		return new Promise(function(onCallback, ngCallback) {
			// 認証データの作成
			let authenticationData = {
				Username: email,
				Password: password
			};
			let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

			let userData = {
				Username: email,
				Pool: userPool
			};
			let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

			// 認証処理
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: function (result) {
					onCallback(new Tokens(result));
				},
				onFailure: function(err) {
					// 直接に ngCallback を書くと分かりづらいため
					ngCallback(err);
				}
			});
		});
	}

	// ログインダイアログオープンの有効化
	$( '.js-modal-open' ).each( function() {
		$( this ).on( 'click', function() {
			// ログインダイアログを表示させる処理
			var target = $( this ).data( 'target' );
			var modal = document.getElementById( target );
			$( modal ).fadeIn( 300 );
			return false;
		});
	});
	// ログインダイアログクローズの有効化
	$( '.js-modal-close' ).on( 'click', function() {
		// ウィンドウ外をクリックした時にログインダイアログをクローズさせる処理
		$( '.js-modal' ).fadeOut( 300 );
		return false;
	});
	// タブコントロールの有効化
	$('#login-tab').tabs();

	// ログイン
	$( '#login-button' ).on( 'click', function() {
		// ログインをクリックした時にログインさせる処理
		let email = $('#login-email').val();
		let pass1 = $('#login-pass').val();
		// ローカルストレージに記録
		if ($('#login-ishold').prop('checked')) {
			setStorage("login", {"email": email, "pass": pass1});
		} else {
			removeStorage("login");
		}
		// ログイン処理
		signIn(email, pass1).then((tokens) => {
			// TODO:応答で未認証だったら認証フェーズにする
		}).catch((err) => {
			alert(err);
		});
		// TODO:応答で未認証だったら認証フェーズにする
		// 未認証だった応答の場合に認証コード入力に遷移させる時のコード
		$('#div-login-input').hide();
		$('#div-signup-confirm').show();
		return false;
	});

	// 新規登録したユーザのアクティベーション
	$( '#signup-confirm-button' ).on( 'click', function() {
		// 認証コード登録をクリックした時にユーザ登録認証させる処理
		let text0 = $('#auth-conf-text_0').val();
		let text1 = $('#auth-conf-text_1').val();
		let text2 = $('#auth-conf-text_2').val();
		let text3 = $('#auth-conf-text_3').val();
		let text4 = $('#auth-conf-text_4').val();
		let text5 = $('#auth-conf-text_5').val();
		alert("code:"+text0+text1+text2+text3+text4+text5);
		// ログイン入力に遷移させる時のコード
		$('#div-signup-confirm').hide();
		$('#div-login-input').show();
		return false;
	});

	// ユーザの新規登録
	$( '#signup-button' ).on( 'click', function() {
		// 登録をクリックした時にユーザ登録させる処理
		let email = $('#signup-email').val();
		let pass1 = $('#signup-pass').val();
		let pass2 = $('#signup-pass-repeat').val();
		// TODO:email チェックも忘れずに
		// TODO:その他未実装
		if (pass1==pass2) {
			alert("succ email:" + email + ", pass:" + pass1);
			// ログインダイアログをクローズさせる処理
			$( '.js-modal' ).fadeOut( 300 );
		} else {
			alert("fail email:" + email + ", pass:" + pass1 + ", pass(rep):" + pass2);
		}
		return false;
	});

	//console.log(getStorage("testParam"));
	//setStorage("testParam", {"key1": 1});
	//console.log(getStorage("testParam"));
	//console.log(removeStorage("testParam"));

	// 「次回から自動的にログインする」の処理
	let l = getStorage("login");
	if (l!=null) {
		$('#login-email').val(l.email);
		$('#login-pass').val(l.pass);
		$('#login-ishold').prop('checked', true);
		// 自動ログイン処理
		signIn(l.email, l.pass).then((tokens) => {
			// TODO:応答で未認証だったら認証フェーズにする
			// 未認証かどうかの検知方法は未定
		}).catch((err) => {
			alert(err);
		});
	}
});

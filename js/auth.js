// @ts-check
"use strict";
/* jshint esversion: 6, laxbreak: true, laxcomma: true, node: true, browser: true, devel: true */
/* globals $:false */

$( function() {
	// ユーザープールの設定
	const poolData = {
		UserPoolId : 'ap-northeast-1_uynOOPJsV',
		ClientId : '19aisb95e3mcl8n1oieghs1grq'
	};
	const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	// IDプールの設定
	// Amazon Cognito 認証情報プロバイダーの初期化
	AWSCognito.config.region = 'ap-northeast-1'; // リージョン
	AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
 	  	IdentityPoolId: 'ap-northeast-1:4c253a26-5a13-47b0-8243-66baf5b2888d'
	});

	/*
	AWSCognito.config.credentials.refresh(err => {
		alert(err);
	});
	*/

	/**
	 * サインアップ
	 * @param {string} email メールアドレス
	 * @param {string} password パスワード
	 * @return {Promise} プロミス
	 */
	 function signUp(email, password) {
		return new Promise(function(onCallback, ngCallback) {
			userPool.signUp(email, password, null, null, function(err, result) {
				if (err) {
					ngCallback(err);
				} else {
					onCallback(result);
				}
			});
		});
	}

	/**
	 * サインアップ認証メール再送
	 * @param {string} email メールアドレス
	 * @return {Promise} プロミス
	 */
	 function signUpResend(email) {
		return new Promise(function(onCallback, ngCallback) {
			let userData = {
				Username: email,
				Pool: userPool
			};
			let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

			cognitoUser.resendConfirmationCode(function(err, result) {
				if (err) {
					ngCallback(err);
				} else {
					onCallback(result);
				}
			});
		});
	}

	/**
	 * サインアップ認証
	 * @param {string} email メールアドレス
	 * @param {string} activationKey 認証コード
	 * @return {Promise} プロミス
	 */
	 function signUpActivation(email, activationKey) {
		return new Promise(function(onCallback, ngCallback) {
			let userData = {
				Username: email,
				Pool: userPool
			};
			let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

			cognitoUser.confirmRegistration(activationKey, true, function(err, result) {
				if (err) {
					ngCallback(err);
				} else {
					onCallback(result);
				}
			});
		});
	}

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
			// ログインダイアログをクローズさせる処理
			$( '.js-modal' ).fadeOut( 300 );
		}).catch((err) => {
			if (err.code=='UserNotConfirmedException') {
				// 応答で未認証だったら認証フェーズにする
				// 未認証だった応答の場合に認証コード入力に遷移させる時のコード
				$('#div-login-input').hide();
				$('#div-signup-confirm').show();
			} else {
				alert(err);
			}
		});
		return false;
	});

	// 新規登録したユーザのアクティベーション
	$( '#signup-confirm-button' ).on( 'click', function() {
		// 認証コード登録をクリックした時にユーザ登録認証させる処理
		let email = $('#login-email').val();
		let text0 = $('#auth-conf-text_0').val();
		let text1 = $('#auth-conf-text_1').val();
		let text2 = $('#auth-conf-text_2').val();
		let text3 = $('#auth-conf-text_3').val();
		let text4 = $('#auth-conf-text_4').val();
		let text5 = $('#auth-conf-text_5').val();
		let activateKey = text0+text1+text2+text3+text4+text5;
		signUpActivation(email, activateKey).then(result => {
			// ログイン入力に遷移させる時のコード
			$('#div-signup-confirm').hide();
			$('#div-login-input').show();
		}).catch(err => {
			alert(err);
		});
		return false;
	});

	// ユーザの新規登録メール再送
	$( '#resend-button' ).on( 'click', function() {
		// 登録メール再送をクリックした時に再送させる処理
		let email = $('#login-email').val();
		if (email) {
			signUpResend(email).catch(err => {
				alert(err);
			});
		}
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
			signUp(email, pass1).then(res => {
				alert(res);
			}).catch(err => {
				alert(err);
			});
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
			if (err.code=='UserNotConfirmedException') {
				// 応答で未認証だったら認証フェーズにする
				// 未認証だった応答の場合に認証コード入力に遷移させる時のコード
				$('#div-login-input').hide();
				$('#div-signup-confirm').show();
			} else {
				alert(err);
			}
		});
	}
});

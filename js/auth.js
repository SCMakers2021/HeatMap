// @ts-check
"use strict";
/* jshint esversion: 6, laxbreak: true, laxcomma: true, node: true, browser: true, devel: true */
/* globals $:false */


$( function() {
	function passwordLogin(email, pass) {
		// TODO:email チェックも忘れずに
		// TODO:その他未実装
		alert("email:" + email + ", pass:" + pass);
	}

	console.log(getStorage("testParam"));
	setStorage("testParam", {"key1": 1});
	console.log(getStorage("testParam"));
	console.log(removeStorage("testParam"));
	
	let l = getStorage("login");
	if (l!=null) {
		$('#login-email').val(l.email);
		$('#login-pass').val(l.pass);
		$('#login-ishold').prop('checked', true);
	}

	$( '.js-modal-open' ).each( function() {
		$( this ).on( 'click', function() {
			// ログインダイアログを表示させる処理
			var target = $( this ).data( 'target' );
			var modal = document.getElementById( target );
			$( modal ).fadeIn( 300 );
			return false;
		});
	});
	$( '.js-modal-close' ).on( 'click', function() {
		// ウィンドウ外をクリックした時にログインダイアログをクローズさせる処理
		$( '.js-modal' ).fadeOut( 300 );
		return false;
	});
	$( '#login-button' ).on( 'click', function() {
		// ログインをクリックした時にログインさせる処理
		let email = $('#login-email').val();
		let pass1 = $('#login-pass').val();
		let isHold = $('#login-ishold').prop('checked');
		passwordLogin(email, pass1);
		if (isHold) {
			setStorage("login", {"email": email, "pass": pass1});
		} else {
			removeStorage("login");
		}
		// 未認証だった応答の場合に認証コード入力に遷移させる時のコード
		$('#div-login-input').hide();
		$('#div-signup-confirm').show();
		return false;
	});
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

	$('#login-tab').tabs();
});

// @ts-check
/* jshint esversion: 6, laxbreak: true, laxcomma: true, node: true, browser: true, devel: true */
/* globals $:false */
"use strict";

$( function() {
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
		// TODO:email チェックも忘れずに
		// TODO:その他未実装
		alert("email:" + email + ", pass:" + pass1);
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
		} else {
			alert("fail email:" + email + ", pass:" + pass1 + ", pass(rep):" + pass2);
		}
		return false;
	});

	$('#login-tab').tabs();
});

// @ts-check
/* jshint esversion: 6, laxbreak: true, laxcomma: true, node: true */
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
});

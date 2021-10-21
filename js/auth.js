// @ts-check
/* jshint esversion: 6, laxbreak: true, laxcomma: true, node: true */
"use strict";

$( function() {
	$( '.js-modal-open' ).each( function() {
		$( this ).on( 'click', function() {
			var target = $( this ).data( 'target' );
			var modal = document.getElementById( target );
			$( modal ).fadeIn( 300 );
			return false;
		});
	});
	$( '.js-modal-close' ).on( 'click', function() {
		$( '.js-modal' ).fadeOut( 300 );
		return false;
	});
});

// @ts-check
"use strict";
/* jshint esversion: 6, laxbreak: true, laxcomma: true, node: true, browser: true, devel: true */
/* globals $:false */

/**
 * データとファイルから切り出し
 * @param {string} dataUrl dataUrl文字列
 * @param {File} file ファイル
 * @return {object} パッキングしたオブジェクト
 */
function dataUrlSplit(dataUrl, file) {
	// dataUrl は "data:image/jpeg;base64,iVBORw0KGgo...." という文字列
	// FileReader のエンコードは base64 固定だと期待することにしておく
	// base64 には "," は入らないので、 "," で分割した最後のブロックをデコードしてファイルに書き込む
	let elems = dataUrl.split(",");
	let base64 = elems[elems.length-1];
	// MIME タイプは image/png とか image/svg+xml, image/bmp ... など
	elems = elems[0].split("data:");
	let contentType = elems[1].split(";")[0];
	// 解釈するよりも file.name から拡張子を取り出して渡したほうが良さそう
	elems = file.name.split(".");
	let ext = elems[elems.length-1];
	// API に送るパラメータ ext, base, contentType というキーにした
	return {ext: ext, base64: base64, contentType: contentType};
}

$( function() {
	// 指定ファイルのプレビュー
	$( '#upldFile' ).on( 'change', function() {
		// 今回は一件でいいので
		let file = document.querySelector('#upldFile').files[0];
		console.log(file);
	  
		if (file) {
			const reader = new FileReader();
			reader.addEventListener("load", (p) => {
				// 画像ファイルの dataUrl とファイル名
				const dataUrl = reader.result;
				const file = reader.file;
				// dataUrl をプレビュー表示
				document.querySelector('#upldPreview').src = dataUrl;
				// TODO: dataUrl を Lambda に送信
				console.log(JSON.stringify(dataUrlSplit(dataUrl, file)));
			}, false);
			// クロージャとしてコールバックで参照できなかったのでくっつけとく
			reader.file = file;
			reader.readAsDataURL(file);
		}
	});

	// アップロードダイアログオープンの有効化
	$( '.upld-modal-open' ).each( function() {
		$( this ).on( 'click', function() {
			// アップロードダイアログを表示させる処理
			var target = $( this ).data( 'target' );
			var modal = document.getElementById( target );
			$( modal ).fadeIn( 300 );
			return false;
		});
	});
	// アップロードダイアログクローズの有効化
	$( '.upld-modal-close' ).on( 'click', function() {
		// ウィンドウ外をクリックした時にダイアログをクローズさせる処理
		$( '.upld-modal' ).fadeOut( 300 );
		return false;
	});
});

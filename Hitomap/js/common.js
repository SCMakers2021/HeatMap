// @ts-check
"use strict";
/* jshint esversion: 6, laxbreak: true, laxcomma: true, node: true, browser: true, devel: true */
/* globals $:false */

/**
 * ストレージからデータを取り出す
 * @param {string} keyName キー
 * @return {object} 値
 */
 function getStorage(keyName) {
	try {
		let param = localStorage.getItem(keyName);
		return JSON.parse(param);
	} catch (error) {
		// file:// のスクリプトで実行したなどでエラー
		console.log("keyName:" + keyName + ": " + error);
		return {};
	}
}

/**
 * ストレージにデータを設定する
 * @param {string} keyName キー
 * @param {object} value 値
 */
 function setStorage(keyName, value) {
	try {
		localStorage.setItem(keyName, JSON.stringify(value));
	} catch (error) {
		// file:// のスクリプトで実行したなどでエラー
		console.log("keyName:" + keyName + ": " + error);
	}
}

/**
 * ストレージからデータを削除する
 * @param {string} keyName キー
 * @return {object} 値
 */
 function removeStorage(keyName) {
	try {
		let oldValue = getStorage(keyName);
		localStorage.removeItem(keyName);
		return oldValue;
	} catch (error) {
		// file:// のスクリプトで実行したなどでエラー
		console.log("keyName:" + keyName + ": " + error);
		return {};
	}
}

$( function() {
	// 共通処理
});

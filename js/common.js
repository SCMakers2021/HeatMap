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

/**
 * Cognite からのトークン情報
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
	// 共通処理
});

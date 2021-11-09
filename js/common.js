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
 * セッションストレージからデータを取り出す
 * @param {string} keyName キー
 * @return {object} 値
 */
 function getSession(keyName) {
	try {
		let param = sessionStorage.getItem(keyName);
		return JSON.parse(param);
	} catch (error) {
		// file:// のスクリプトで実行したなどでエラー
		console.log("keyName:" + keyName + ": " + error);
		return {};
	}
}

/**
 * セッションストレージにデータを設定する
 * @param {string} keyName キー
 * @param {object} value 値
 */
 function setSession(keyName, value) {
	try {
		sessionStorage.setItem(keyName, JSON.stringify(value));
	} catch (error) {
		// file:// のスクリプトで実行したなどでエラー
		console.log("keyName:" + keyName + ": " + error);
	}
}

/**
 * セッションストレージからデータを削除する
 * @param {string} keyName キー
 * @return {object} 値
 */
 function removeSession(keyName) {
	try {
		let oldValue = getStorage(keyName);
		sessionStorage.removeItem(keyName);
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
	constructor(result=null) {
		this.idToken = "";
		this.accessToken = "";
		this.refreshToken = "";
		if (result) {
			this.idToken = result.getIdToken().getJwtToken();		  // IDトークン
			this.accessToken = result.getAccessToken().getJwtToken();  // アクセストークン
			this.refreshToken = result.getRefreshToken().getToken();   // 更新トークン
			setSession("tokens", {
				"idToken": this.idToken
				, "accessToken": this.accessToken
				, "refreshToken": this.refreshToken
			});
		} else {
			let obj = getSession("tokens");
			if (obj.idToken) {
				this.idToken = obj.idToken;
				this.accessToken = obj.accessToken;
				this.refreshToken = obj.refreshToken;
			}
		}
	}
	/** @return {string} IDトークン */
	get IdToken() {
		return this.idToken;
	}
	/** @return {string} アクセストークン */
	get AccessToken() {
		return this.accessToken;
	}
	/** @return {string} 更新トークン */
	get RefreshToken() {
		return this.refreshToken;
	}
	/** @return {string} サブジェクト */
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

/**
 * HeatMap API 呼び出し時の fetch をラップして認証情報を付加する
 * @param {string} url APIのURL
 * @param {object} options オプション
 * @return Promise<Response>
 */
function apiFetch(url, options) {
	if (options) {
		let tokens = new Tokens();
		if (tokens.Sub) {
			// TODO: 認証情報
			options.headers.append("X-Subject", tokens.Sub);
		}
	}
	return fetch(url, options);
}

$( function() {
	// 共通処理
});

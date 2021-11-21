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
			// @see https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/RESTAuthentication.html
			//    Authorization: AWS AWSAccessKeyId:Signature
			let auth = tokens.Sub;
			options.headers.append("Authorization", auth);
			// @see https://qiita.com/baikichiz/items/ed787c5c79059213401e
			//    X-Api-Key は API Gateway で API ごとに定義するらしい
			//    options.headers.append("X-Api-Key", "");
			// @see https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/RESTAuthentication.html
			//    X-Amz-Security-Token は IAM が提供する AWS Security Token
			//    options.headers.append("X-Amz-Security-Token", "");
		}
	}
	return fetch(url, options);
}

$( function() {
	// 共通処理

});

// グローバル変数宣言
var token = new Tokens();
var AmariPicJson;
const ModeInit = 0;
// 定義
var MODE_Define = defineEnum({
    INIT : {
        value : 1,
    },
    SAGASU : {
        value : 2,
    },
    AMARI : {
        value : 3,
    }
});

var ScreenMode = MODE_Define.INIT.value;	// 画面遷移の状態
console.log("common.js："+String(ScreenMode));
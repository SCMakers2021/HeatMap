// 「カテゴリアイコン」ボタン押下
function searchCategoryClicked( key ){
	var id = "searchCategory" + key;
	console.log(`TODO:検索 = ${id}`);
    ReadDB(key);
}

function ReadDB(key){
	if(markers != null){
	  // プルダウンからカテゴリを選択
	  let category = document.getElementById('category');
	  var latlngBounds = map.getBounds();
	  var swLatlng = latlngBounds.getSouthWest();
	  var swlat = swLatlng.lat();
	  var swlng = swLatlng.lng();
	
	  var neLatlng = latlngBounds.getNorthEast();
	  var nelat = neLatlng.lat();
	  var nelng = neLatlng.lng();
	
	  var posiData = {

        	latUnder: nelat ,
			latUpper: swlat ,
			lngUnder: nelng ,
			lngUpper: swlng 

	  };
  
	  var sql = "SELECT * FROM HeatMapStoreInfo where categoryID " + key;
	  console.log(`SQL = ${sql}`);
	  
	  var data = {
		  function: "ReadStoreInfo",
		  category: category.selectedIndex,
		  position: posiData,
		  sql: sql
	  };

	  // instantiate a headers object
	  var myHeaders = new Headers();
	  // add content type header to object
	  myHeaders.append("Content-Type", "application/json");
	  // using built in JSON utility package turn object to string and store in a variable
	  var ele = JSON.stringify({Element: data}, null, ' ');
	  // create a JSON object with parameters for API call and store in a variable
	  var requestOptions = {
		  method: 'POST',
		  headers: myHeaders,
		  body: ele,
		  redirect: 'follow'
	  };
	  //JSONデータを操作する
	  getJSONdata(HeatMapURL,requestOptions)

	}
};

 async function getJSONdata(HeatMapURL,requestOptions){

	const res = await fetch(HeatMapURL, requestOptions);
    const resjson = await res.json();

    var comstr;
    var latobj;
    var lngobj;
	var cominf;
	var latinf; 
	var lnginf; 
    var obj;
    obj = JSON.parse(JSON.stringify(resjson)).body;
    const cnt = obj.indexOf('Count')
	const suuji =  obj.substring(cnt + 7,cnt + 9)

	const numb_tmp = Number(suuji)

    var infarray = {};
    var tmp_obj = obj;
    var lngnumber = 0;

	for (var i = 0; i < numb_tmp; i++){
    
		comstr = tmp_obj.indexOf('StoreComment',lngnumber)
		latobj = tmp_obj.indexOf('lat',lngnumber)
		lngobj = tmp_obj.indexOf('lng',lngnumber)
		if (comstr = -1){
			cominf = ""
		}else{
			cominf = tmp_obj.substring(comstr + 6,latobj - 4)
		}
		latinf  = tmp_obj.substring(latobj + 6,latobj + 23)
        lnginf = tmp_obj.substring(lngobj + 6,lngobj + 23)

		infarray[i] = {comment:cominf,lat:latinf,lng:lnginf}
		lngnumber = lngobj + 25
	};

	set_latlng(infarray,i);
	
}

function set_latlng(arrayData,n){

	for (var i = 0; i < n; i++){

		console.log('要素１',arrayData[i].lat)
		var center = {
			lat: Number(arrayData[i].lat), // 緯度
			lng: Number(arrayData[i].lng) // 経度
		  };
		marker = new google.maps.Marker({ // マーカーの追加
    	    position: center, // マーカーを立てる位置を指定
    	  map: map // マーカーを立てる地図を指定
   		});
	}

}



function onEntryBtnClicked(){
	var btnVal = $('#btnAmari').val();
	if( "valid" == btnVal ){
		return;
	}
	var isHidden = $('#map_modal').attr('hidden');
	if( 'hidden' == isHidden  ){
		$('#map_modal').attr('hidden',false);
		$('#map_hidden').attr('hidden',false);
	}else{
		$('#map_modal').attr('hidden',true);
	}
}

// 次へと確定のボタン切り替え
// true：次へを有効　false：確定を有効
function switchAmariButtom(flag){
	if( true == flag ){
		// 次へボタンを有効
		$('#amariSubmit').css("visibility", "hidden");
		$('#amariNext').css("visibility", "visible");
		console.log("TODO：次へボタンを有効");
	}else{
		// 確定ボタンを有効
		$('#amariSubmit').css("visibility", "visible");
		$('#amariNext').css("visibility", "hidden");
		console.log("TODO：確定ボタンを有効");
	}
}

$(function(){
	function switchAmariMode(flag){
		if( true == flag ){
			$("#btnSagasu").toggleClass("topModeChange-Sagasu-hover",false);	// ボタンを押した動作を削除
			$("#btnAmari").toggleClass("topModeChange-Amari-hover",true);	// ボタンを押す動作を追加
			$('#btnAmari').val("invalid");
			ScreenMode = MODE_Define.AMARI.value;
			console.log("TODO：アマリ登録モードへ");
		}else{
			//$('#btnAmari').attr('src',"image/AmariActive.png");
			$('#btnAmari').val("valid");
		}
	}
	function switchSagasuMode(flag){
		if( true == flag ){
			$("#btnSagasu").toggleClass("topModeChange-Sagasu-hover",true);	// ボタンを押す動作を追加
			$("#btnAmari").toggleClass("topModeChange-Amari-hover",false);	// ボタンを押した動作を削除
			$('#btnSagasu').val("invalid");
			$('#SagasuSidebar').attr('hidden',false);
			ScreenMode = MODE_Define.SAGASU.value;
			console.log("TODO：サガスモードへ");
			CancelAmariMode();	// アマリモードをキャンセルした場合の処理

			$('#map_modal').attr('hidden',true);
			$('#map_hidden').attr('hidden',true);
		}else{
			//$('#btnSagasu').attr('src',"image/SagasuActive.png");
			$('#btnSagasu').val("valid");
			$('#SagasuSidebar').attr('hidden',true);
		}
	}



	//--------------------------------------------
	// ハンドライベント実装
	//--------------------------------------------
	// 「サガス」ボタン押下
	$('#btnSagasu').click(function(){
		var btnVal = $('#btnSagasu').val();
		if( "valid" == btnVal ){
			// サガスモード移行
			switchAmariMode(false);
			switchSagasuMode(true);
		}else{
			// すでに押している場合は何もしない
			//switchAmariMode(true);
			//switchSagasuMode(false);
		}
	})
	// 「アマリ」ボタン押下
	$('#btnAmari').click(function(){
		var btnVal = $('#btnAmari').val();
		if( "valid" == btnVal ){
			// アマリモード移行
			switchAmariMode(true);
			switchSagasuMode(false);
		}else{
			// すでに押している場合は何もしない
			//switchAmariMode(false);
			//switchSagasuMode(true);
		}
	})
	// 「ユーザ」ボタン押下
	$('#btnUser').click(function(){
		console.log("TODO：ログインしたい");
	})

	// アマリ「次へ」ボタン押下
	$('#amariNext').click(function(){
		if(token!=null){
			switchAmariButtom(false);	// 確定ボタンを有効化
			// tweetボタンを生成
			CreateTweetButton();
		}else{
			alert("ログインしてください。");
		}
	})

	function MoveAmariTopPage(){
		$('#map_modal').attr('hidden',true);
		$('#map_hidden').attr('hidden',true);
		switchAmariButtom(true);	// 次へボタンを有効化
	}

	// アマリ「確定」ボタン押下
	$('#amariSubmit').click(function(){
		// DBに登録
		RegisterDB();

		// 移動
		MoveAmariTopPage();
	})

	// アマリ「キャンセル」ボタン押下
	$('#amariCancel').click(function(){
		MoveAmariTopPage();
	})
});
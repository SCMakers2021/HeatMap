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
  
  //	var latUnder = markers[0].position.lat() - 1;
  //	var latUpper = markers[0].position.lat() + 1;
  //	var lngUnder = markers[0].position.lng() - 1;
  //	var lngUpper = markers[0].position.lng() + 1;
	  var posiData = {
		  latUnder: markers[0].position.lat() - 1,
		  latUpper: markers[0].position.lat() + 1,
		  lngUnder: markers[0].position.lng() - 1,
		  lngUpper: markers[0].position.lng() + 1
	  };
  
	  var sql = "SELECT * FROM HeatMapStoreInfo where categoryID " + key;
	  console.log(`SQL = ${sql}`);
	  
	  var data = {
		  function: "ReadData",
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
	  // make API call with parameters and use promises to get response
	  fetch(HeatMapURL, requestOptions)
	  .then(response => response.text())
	  .then(result => alert(JSON.parse(result).body))
	  .catch(error => console.log('error', error));
	}
  };


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
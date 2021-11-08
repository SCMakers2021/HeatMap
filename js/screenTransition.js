// 「カテゴリアイコン」ボタン押下
function searchCategoryClicked( key ){
	var id = "searchCategory" + key;
	console.log("TODO:検索 = " + id);
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


$(function(){
	function switchAmariMode(flag){
		if( true == flag ){
			$('#btnAmari').attr('src',"image/AmariNegative.png");
			$('#btnAmari').val("invalid");
			console.log("TODO：アマリ登録モードへ");
		}else{
			$('#btnAmari').attr('src',"image/AmariActive.png");
			$('#btnAmari').val("valid");
		}
	}
	function switchSagasuMode(flag){
		if( true == flag ){
			$('#btnSagasu').attr('src',"image/SagasuNegative.png");
			$('#btnSagasu').val("invalid");
			$('#SagasuSidebar').attr('hidden',false);
			console.log("TODO：サガスモードへ");

			$('#map_modal').attr('hidden',true);
			$('#map_hidden').attr('hidden',true);
		}else{
			$('#btnSagasu').attr('src',"image/SagasuActive.png");
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
			switchAmariMode(false);
			switchSagasuMode(true);
		}else{
			switchAmariMode(true);
			switchSagasuMode(false);
		}
	})
	// 「アマリ」ボタン押下
	$('#btnAmari').click(function(){
		var btnVal = $('#btnAmari').val();
		if( "valid" == btnVal ){
			switchAmariMode(true);
			switchSagasuMode(false);
		}else{
			switchAmariMode(false);
			switchSagasuMode(true);
		}
	})
	// 「ユーザ」ボタン押下
	$('#btnUser').click(function(){
		console.log("TODO：ログインしたい");
	})

	// アマリ「次へ」ボタン押下
	$('#amariNext').click(function(){
		console.log("TODO：「次へ」したい");
	})
	// アマリ「キャンセル」ボタン押下
	$('#amariCancel').click(function(){
		$('#map_modal').attr('hidden',true);
		$('#map_hidden').attr('hidden',true);
	})
});
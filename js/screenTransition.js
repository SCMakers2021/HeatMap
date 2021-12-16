var SagasuSidebarIsHidden = false;

// 「カテゴリアイコン」ボタン押下
function searchCategoryClicked( key ){
	// SelectCategoryPanel(key);
	// パネルの選択状態を切り替え
	SwitchCategoryPanel(key);
	// 選択中パネルのキー一覧を取得
	var keyList = GetSelectedCategoryPanelKeyList();
	// var id = "searchCategory" + key;
	// console.log(`TODO:検索 = ${id}`);
	if(keyList.length != 0){
		ClearSagasuMarker();
		GetSagasuInfo(keyList);
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
	
	// サイドバー表示
	function ShowSidebar(){
		SagasuSidebarIsHidden = false;
		$("#SagasuSidebar").toggleClass("sidebarhide",false);	// サイドバー非表示を無効
		$("#SagasuSidebar").toggleClass("sidebarshow",true);	// サイドバー表示を有効
		$('#SagasuSidebar').attr('hidden',false);
	}
	// サイドバー非表示
	function HiddenSidebar(){
		$("#SagasuSidebar").toggleClass("sidebarhide",true);	// サイドバー非表示を有効
		$("#SagasuSidebar").toggleClass("sidebarshow",false);	// サイドバー表示を無効
		$('#SagasuSidebar').attr('hidden',true);
	}
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
			ShowSidebar();	// サイドバー表示
			ScreenMode = MODE_Define.SAGASU.value;
			console.log("TODO：サガスモードへ");
			CancelAmariMode();	// アマリモードをキャンセルした場合の処理

			$('#map_modal').attr('hidden',true);
			$('#map_hidden').attr('hidden',true);
		}else{
			//$('#btnSagasu').attr('src',"image/SagasuActive.png");
			StartAnimationHiddenSidebar();	// サイドバー非表示
		}
	}

	// サイドバー非表示のアニメーション開始
	function StartAnimationHiddenSidebar(){
		$('#btnSagasu').val("valid");
		SagasuSidebarIsHidden = true;
		$("#SagasuSidebar").toggleClass("sidebarhide",true);	// サイドバーを隠す
	}

	function EventAnimationEnd(){
		// サイドバー表示しているなら非表示にする
		HiddenSidebar();
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
			// すでに押している場合は解除だけする
			// switchAmariMode(true);
			switchSagasuMode(false);
		}
	})
	// 「アマリ」ボタン押下
	$('#btnAmari').click(function(){
		if(token.IsLogin() == false){
			alert("「アマリ」情報を登録する場合はログインしてください");
			FadeInLoginDialog();
			return;
		}
		var btnVal = $('#btnAmari').val();
		if( "valid" == btnVal ){
			// アマリモード移行
			switchAmariMode(true);
			switchSagasuMode(false);

			// サガスの結果を削除
			// ClearSagasuMarker();
		}else{
			// すでに押している場合は解除だけする
			switchAmariMode(false);
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

	
	
	// サイドバーのクローズボタン
	$('#SagasuSidebarCloseButton').click(function(){
		StartAnimationHiddenSidebar();
	})
	// アニメーション終わりのイベントを捕まえる
	const animated = document.getElementById('SagasuSidebar');
	animated.addEventListener('animationend', () => {
		if(SagasuSidebarIsHidden == true){
			// サイドバー表示しているなら非表示にする
			EventAnimationEnd();
		}
	});
	
});
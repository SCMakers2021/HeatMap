/* map関係のオブジェクトをグローバルで定義 */
var map = {};
var marker,infoWindow,markers=[];
var address;

function getMassage(){
  const textbox = document.getElementById("input-message");
  return textbox.value;
};


$(function() {
  /* 対象となるタイトルを持ったマーカーの詳細を開く */
  $(".location a").click(function() {
    for(var i = 0; i < markers.length; i++) {
      if(marker[i].title == $(this).attr("data-title")) {
        //マーカーとタイトルが一致したら詳細を表示
        infoWindow[i].open(map, marker[i]);
      } else {
        //マーカーとタイトルが一致しなければ詳細を閉じる
        infoWindow[i].close();
      }
    }
    return false;
  });
});

function DispStreetView(e){
	return new Promise(function(resolve,reject) {
		const panorama = new google.maps.StreetViewPanorama(
		document.getElementById("currentPointArea"),
		{
		  position: e.latLng,
		  pov: {
		    heading: 34,
		    pitch: 10,
		  },
		  visible: true,
      addressControl: false,      // 住所表示
      clickToGo: false ,          // クリックによる移動
      fullscreenControl: false ,  // 全画面表示
      //panControl: false ,         // コンパスの表示
      linksControl: false ,       // 座標移動の矢印の表示
      zoomControl: false ,        // ズームコントローラの表示
		}
		);
		map.setStreetView(panorama);
		
		resolve('Success!DispStreetView()');
	});
}

function DispStreetView2(e){
	return new Promise(function(resolve,reject) {
		const panoramaAmariFormMap = new google.maps.StreetViewPanorama(
      document.getElementById("currentPointArea2"),
      {
        position: e.latLng,
        pov: {
          heading: 34,
          pitch: 10,
        },
        visible: true,
        addressControl: false,      // 住所表示
        clickToGo: false ,          // クリックによる移動
        fullscreenControl: false ,  // 全画面表示
        panControl: false ,         // コンパスの表示
        linksControl: false ,       // 座標移動の矢印の表示
        zoomControl: false ,        // ズームコントローラの表示
      }
      );
    map.setStreetView(panoramaAmariFormMap);
		
		resolve('Success!DispStreetView2()');
	});
}

function CreateInfoWindow(address){
    infoWindow = new google.maps.InfoWindow({
        content:   "<div id='speechBubble' value='init'>" 
                 + address
                 + "  <div class='AmariForm' id='AmariFormMap'>"
                 + "  <div class='currentPointArea' id='currentPointArea'></div>"
                 + "    <input class='okButton' type='button' value='投稿' onclick='onEntryBtnClicked()'>"
                 + "  </div>"
                 + "</div>",
//        position: new google.maps.LatLng(,),  //吹き出しの位置
//        pixelOffset: new google.maps.Size( -225, 0 ),  // クリック箇所に対する吹き出しの先端の位置
      });
}

function MakeInfoWindow(e){
	return new Promise(function(resolve,reject) {
	    // 場所の住所の準備
	    geocoder = new google.maps.Geocoder();
	    
	    geocoder.geocode({
	      latLng: e.latLng
	    }, function(results, status) {
	    
		    address = results[0].formatted_address.replace(/^日本, /, '');
		    document.getElementById("AmariFormAddress").innerText = address; // アマリ登録画面（情報入力）の住所も更新
		    /* 場所の詳細の準備 */
		    CreateInfoWindow(address);
		    infoWindow.open(map, marker);
		      
		    resolve('Success!MakeInfoWindow()');
    	});
	});
}

// 現在位置に移動(コールバック)
function successGeoLocationCallback(position){
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  
  map.panTo(new google.maps.LatLng(lat,lng));
};
// 現在位置に移動(エラーのコールバック)
function errorCallback(error){
  switch(error.code) {
    case 1: //PERMISSION_DENIED
      alert("位置情報の利用が許可されていません");
      break;
    case 2: //POSITION_UNAVAILABLE
      alert("現在位置が取得できませんでした");
      break;
    case 3: //TIMEOUT
      alert("タイムアウトになりました");
      break;
    default:
      alert("その他のエラー(エラーコード:"+error.code+")");
      break;
  }
};
// 現在位置に移動
function MoveNowPosition(){
  navigator.geolocation.getCurrentPosition(successGeoLocationCallback, errorCallback);
}

// クリックイベントを作成
// クリックしたらマーカーを設置
function initialize() {
  // 表示する場所のidを取得
  var target = document.getElementById("map_canvas") 
  // 経度：lat，緯度：lngを設定
  var centralLatLng = {lat: 34.757555, lng: 135.497010};
  var options = {
    zoom: 16, // ズーム1は一番小さい
    center: centralLatLng, //Mapの中央:上の座標
    mapTypeControl: false, //マップタイプ コントロール
    fullscreenControl: false, //全画面表示コントロール
    streetViewControl: false, //ストリートビュー コントロール
    zoomControl: true //ズーム コントロール
  };
  // Mapを作成
  map = new google.maps.Map(target, options);

  /* マーカーのアイコンの設定 */
  var markerImage = {
    url: "image/maker.Red.png", //画像のURL
    size: new google.maps.Size(32, 32), //サイズ
    origin: new google.maps.Point(0, 0), //アイコンの基準位置
    anchor: new google.maps.Point(16, 32), //アイコンのアンカーポイント
    scaledSize: new google.maps.Size(32, 32) //アイコンのサイズ
  };
  
  CreateInfoWindow("");	// 最初に表示しておかないと画像が表示されないため、用意だけしておく。
  infoWindow.close();

  // 現在位置に移動
  MoveNowPosition();
  // ボタンの初期表示
  switchAmariButtom(true);	// 次へボタンを有効化
  // 日付を今日にする
  //SetToday();

  // Mapをクリックする時の動作
  map.addListener("click",function(e){
    // コンソールで経度を表示
    console.log("lat: " + e.latLng.lat());
    // コンソールで緯度を表示
    console.log("lng: " + e.latLng.lng());
    // コンソールで{経度,緯度}を表示
    console.log("(lat,lng): " + e.latLng.toString());
    // this.setCenter(e.latLng); // クリックする場所をMapの中心にする(画面の移動速度が速い)
    this.panTo(e.latLng); //クリックする場所をMapの中心にする(画面の移動速度がゆっくり)
    
    if(marker != null){
      marker.setMap(null);
    }
    
    // クリックする場所をマーカーを立てる
    marker = new google.maps.Marker({
      position: e.latLng,
      map: map,
      icon: markerImage,
      title: e.latLng.toString(),
      animation: google.maps.Animation.DROP // マーカーを立つときのアニメーション
    });
    // 上で立てたマーカーをもう一度クリックするとマーカーを削除
    //marker.addListener("click",function(){
    //  this.setMap(null);
    //});
    
    /* マーカーの情報を設定 */
//    markers = [
//      {
//        position: e.latLng,
//        title: '投稿',
//        summary: 'getMassage()',
//        figure: 'images/figure01.jpg'
//      }
//    ];
    
    
    // 吹き出しを表示
	MakeInfoWindow(e)
		.then(resolve => {
			console.log(resolve);
		    // streetビューの表示(吹き出しが出た後じゃないとIDが取れないので)
	    	return DispStreetView(e);
	    })
	    .then(resolve => {
			  console.log(resolve);
        return DispStreetView2(e);
		    })
        .then(resolve => {
          console.log(resolve);
          })
		.catch(reject => {
			console.log(reject);
		});

    /* マーカーをクリックしたら場所の詳細を表示 */
    google.maps.event.addListener(marker, 'click', function(e) {
      for(var i = 0; i < markers.length; i++) {
        if(marker.position.G == e.latLng.G && marker.position.K == e.latLng.K) {
          //クリックしたマーカーだったら詳細を表示
          infoWindow.open(map, marker);
        } else {
          //クリックしたマーカーでなければ詳細を閉じる
          infoWindow.close();
        }
      }
    });

    
  });
   // 現在地ボタンのエレメントを作成
  const MoveCurrentPlaceButtonDiv = document.createElement("div");
  AddMoveCurrentPlaceButton(MoveCurrentPlaceButtonDiv);

  //Google MAPS APIに作成したボタンを渡す
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(MoveCurrentPlaceButtonDiv);

  //検索バーのエレメントを作成
  const SearchBarDiv = document.createElement("div");
  AddSearchBar(SearchBarDiv);

  //Google MAPS APIに作成した検索バーを渡す
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(SearchBarDiv);
};

function visualize(){
  heatMapData = [
    //{location: new google.maps.LatLng(marker.position.lat, marker.position.lng), weight: 0.5},
    {location: marker.position, weight: 4},
    {location: new google.maps.LatLng(35.43820870035895,139.27825203125), weight: 2},
  ];
  heatmap = new google.maps.visualization.HeatmapLayer({
   data: heatMapData,
   map: map,
   radius:50,	// 各データ ポイントの影響の半径 (ピクセル単位)。
  });
};

 // 受け取ったDivにimgタブとボタンとしての機能を割り当て
function AddMoveCurrentPlaceButton(controlDiv) {

  const controlUI = document.createElement("img");

  controlUI.classList.add("CurrentPositionButton")
  controlUI.setAttribute("src", "./image/三角矢印.png")

   controlDiv.appendChild(controlUI);

  controlUI.addEventListener("click", () => {
    MoveNowPosition();
  });
}

function AddSearchBar(controlDiv){

  const input = document.createElement("input");

  input.setAttribute("type","text")

  input.classList.add("SearchBar");

  controlDiv.appendChild(input);

}

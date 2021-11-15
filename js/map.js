/* map関係のオブジェクトをグローバルで定義 */
var map = {};
var marker,infoWindow,markers=[];

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
		//document.getElementById("street"),
		document.getElementById("currentPointArea"),
		{
		  position: e.latLng,
		  pov: {
		    heading: 34,
		    pitch: 10,
		  },
		  visible: true,
		}
		);
		map.setStreetView(panorama);
		
		resolve('Success!DispStreetView()');
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
	    
		    var address = results[0].formatted_address.replace(/^日本, /, '');
		    
		    /* 場所の詳細の準備 */
		    CreateInfoWindow(address);
		    infoWindow.open(map, marker);
		      
		    resolve('Success!MakeInfoWindow()');
    	});
	});
}

// クリックイベントを作成
// クリックしたらマーカーを設置
function initialize() {
  // 表示する場所のidを取得
  var target = document.getElementById("map_canvas") 
  // 経度：lat，緯度：lngを設定
  var centralLatLng = {lat: 34.757555, lng: 135.497010};
  var options = {
    zoom: 10, // ズーム1は一番小さい
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
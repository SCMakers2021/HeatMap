/* map関係のオブジェクトをグローバルで定義 */
var map = {};
var heatmap;
var marker,infoWindow,markers=[];
const HeatMapURL = "https://z06c2y3yq8.execute-api.ap-northeast-1.amazonaws.com/dev";

function getMassage(){
  const textbox = document.getElementById("input-message");
  return textbox.value;
};

function RegisterDB(){
  if(markers != null){
	// プルダウンからカテゴリを選択
	let category = document.getElementById('category');

    var data = {
    	function: "InsertData",
    	category: category.selectedIndex,
        position: markers[0].position,
        summary: markers[0].summary,
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

function ReadDB(){
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

    var data = {
    	function: "ReadData",
    	category: category.selectedIndex,
        position: posiData
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

//function ReadDB(){
//  if(markers != null){
//
//    var data = {
//        position: markers[0].position,
//        summary: markers[0].summary,
//    };
//    
//    
//    // instantiate a headers object
//    var myHeaders = new Headers();
//    // add content type header to object
//    myHeaders.append("Content-Type", "application/json");
//  // using built in JSON utility package turn object to string and store in a variable
//  var ele = JSON.stringify({Element: data}, null, ' ');
//    // create a JSON object with parameters for API call and store in a variable
//    var requestOptions = {
//        method: 'GET',
//        headers: myHeaders,
//        body: ele,
//        redirect: 'follow'
//    };
//
//	var latUnder = markers[0].position.lat() - 1;
//	var latUpper = markers[0].position.lat() + 1;
//	var lngUnder = markers[0].position.lng() - 1;
//	var lngUpper = markers[0].position.lng() + 1;
//    const categoryid   = encodeURIComponent("1");
//    // URL?category=1&latUnder=35.5&latUpper=36.5&lngUnder=135.1&lngUpper=136.1
//    var request = HeatMapURL + '?category=' + categoryid
//     + '&latUnder=' + latUnder + '&latUpper=' + latUpper + '&lngUnder=' + lngUnder + '&lngUpper=' + lngUpper;
//	fetch(request)
//	  .then((res)=>{
//	  	console.log(res);
//	    return( res.json() );
//	  })
//	  .then((json)=>{
//	    // ここに何らかの処理
//	    console.log('jsonのルート');
//	    console.log(json);
//	  });
//    
//  }
//};

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

// クリックイベントを作成
// クリックしたらマーカーを設置
function initialize() {
  // 表示する場所のidを取得
  var target = document.getElementById("map_canvas") 
  // 経度：lat，緯度：lngを設定
  var latlng = {lat: 35.383575, lng: 139.344170};
  var options = {
    zoom: 10, // ズーム1は一番小さい
    center: latlng, //Mapの中央:上の座標
    mapTypeControl: false, //マップタイプ コントロール
    fullscreenControl: false, //全画面表示コントロール
    streetViewControl: false, //ストリートビュー コントロール
    zoomControl: true //ズーム コントロール
  };
  // Mapを作成
  map = new google.maps.Map(target, options);

  /* マーカーのアイコンの設定 */
  var image = {
    url: "image/maker.Red.png", //画像のURL
    size: new google.maps.Size(32, 32), //サイズ
    origin: new google.maps.Point(0, 0), //アイコンの基準位置
    anchor: new google.maps.Point(16, 32), //アイコンのアンカーポイント
    scaledSize: new google.maps.Size(32, 32) //アイコンのサイズ
  };

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
      icon: image,
      title: e.latLng.toString(),
      animation: google.maps.Animation.DROP // マーカーを立つときのアニメーション
    });
    // 上で立てたマーカーをもう一度クリックするとマーカーを削除
    //marker.addListener("click",function(){
    //  this.setMap(null);
    //});
    
    /* マーカーの情報を設定 */
    markers = [
      {
        position: e.latLng,
        title: '投稿',
        summary: 'getMassage()',
        figure: 'images/figure01.jpg'
      }
    ];
    
    /* 場所の詳細の準備 */
    infoWindow = new google.maps.InfoWindow({
//      content: '<section style="margin-top:5px;"><figure style="float: left;"><img src="' + markers[0].figure + '" width="64px"></figure><div style="margin-left: 74px;"><h2 style="margin-bottom: 5px;font-size: 1.17em;">' + markers[0].title + '</h2><p style="font-size: 0.84em;">' + markers[0].summary + '</p></div><div><input type="button" value="test2" onclick="visualize()" onkeypress="visualize()" /></div><input type="text" id="activationKey" placeholder="Activation Key"></section>'
      content:   "<div id='speechBubble' value='init'>" 
               + "  <div class='AmariForm' id='AmariFormMap'>"
               + "  <div class='currentPointArea'></div>"
               + "    <input class='okButton' type='button' value='投稿' onclick='onEntryBtnClicked()'>"
               + "  </div>"
               + "</div>"
    });
    infoWindow.open(map, marker);
    
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
  
//  const categoryList = 
//          ["寿司", "天ぷら", "おでん"];
//
//   const selectCategoryName = document.getElementById('category');
//   //menuList.disabled = false; //選択可能な状態にする
//   //選択されたジャンルのメニュー一覧に対して処理をする
//   categoryList.forEach((category, index) => {
//     const option = document.createElement('option'); //option要素を新しく作る
//     option.value = index; //option要素の値に、メニューを識別できる番号を指定する
//     option.innerHTML = category; //ユーザー向けの表示としてメニュー名を指定する
//     selectCategoryName.appendChild(option); //セレクトボックスにoption要素を追加する
//   });
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
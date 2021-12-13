class classSagasuInf {
    constructor(deadTime) {
      this.deadTime = deadTime;
    }
  }
var sagasuMarkers=[];
var sagasuInfoWindows =[];
var sagasuInf=[];
var IsSagasuMarkerInTheWindow = false;

// サガスマーカーをすべてクリア
function  ClearSagasuMarker(){
    if(sagasuMarkers[0] != null){
        sagasuMarkers.forEach(function(elem, index) {
            elem.setMap(null);
        });
    }

    sagasuMarkers=[];
    sagasuInfoWindows =[];
    sagasuInf=[];
}

// サガスマーカーを表示
function visibleSagasuMarker(index){
    sagasuMarkers[index].setVisible(true);
    // sagasuInfoWindows[index].open(map, sagasuMarkers[index]);
}

// サガスマーカーを非表示
function hiddenSagasuMarker(index){
    sagasuMarkers[index].setVisible(false);
    sagasuInfoWindows[index].close();
}

// 該当のウィンドウを表示
function openSagasuMarkerWindowLap(e){
    openSagasuMarkerWindow(e.latLng.lat(),e.latLng.lng());
}

// 該当の座標のウィンドウを表示
function openSagasuMarkerWindow(lat,lng){
    var ClickIndex=0;
    // どれがクリックされたかを判断
    sagasuMarkers.forEach(function(elem, index) {
        if(elem.position.lat() == lat && elem.position.lng() == lng) {  
        ClickIndex = index;
        }else{
        // 違うのは閉じる
        sagasuInfoWindows[index].close();
        }
    });
    console.log(ClickIndex);
    //クリックしたマーカーの詳細を表示
    sagasuInfoWindows[ClickIndex].open(map, sagasuMarkers[ClickIndex]);
}

// ウィンドウをすべて閉じる
function closeSagasuMarkerWindow(e){
    sagasuMarkers.forEach(function(elem, index) {
        // すべて閉じる
        sagasuInfoWindows[index].close();
    });
}
    
// ウィンドウ内か判定
function IsInTheWindow(sw,ne,pos){
    var swlat = sw.lat(); // 下の線
    var swlng = sw.lng(); // 左の線
    var nelat = ne.lat(); // 上の線
    var nelng = ne.lng(); // 右の線

    var lat = pos.lat();
    var lng = pos.lng();
    if((lat > swlat) && (lat <= nelat)
    && (lng > swlng) && (lng <= nelng)){
        return true;
    }else{
        return false;
    }
}

//マーカーを立てる
function setSagasuMarker(ItemArray){
    var height;
    var pos;
    var latlngBounds = map.getBounds();
    var swLatlng = latlngBounds.getSouthWest();
    var neLatlng = latlngBounds.getNorthEast();

    /* マーカーのアイコンの設定 */
    var markerImage;

    if(ItemArray.length == 0){
        alert("検索結果は0件です");
        return;
    }
    for (var i = 0; i < ItemArray.length; i++){
        // console.log('要素: %d 緯度：%s',i,ItemArray[i].lat);
        pos = {
            lat: Number(ItemArray[i].lat), // 緯度
            lng: Number(ItemArray[i].lng) // 経度
        };
        markerImage = {
            // url: ItemArray[i].imagePath, //画像のURL
            url: getCategoryPath(ItemArray[i].categoryID), //画像のURL
            size: new google.maps.Size(32, 32), //サイズ
            scaledSize: new google.maps.Size(32, 32) //アイコンのサイズ
        };
        sagasuMarkers[i] = new google.maps.Marker({
                position: pos,
                map: map,
                icon: markerImage,
                animation: google.maps.Animation.DROP // マーカーを立つときのアニメーション
            });
        // マーカーにマウスを乗せたときにウィンドウを表示
        google.maps.event.addListener(sagasuMarkers[i], 'mouseover', openSagasuMarkerWindowLap);
        // google.maps.event.addListener(sagasuMarkers[i], 'mouseout', closeSagasuMarkerWindow);

        if(true == isSmartPhone()){
            height = 50;
        }else{
            height = 200;
        }
        sagasuInfoWindows[i] = new google.maps.InfoWindow({ // 吹き出しの追加
        content:  "<div>"
                    + "<img id='SagasuInfoWindow' src=" + ItemArray[i].imagePath + " height = " + height + ">"
                + "</div>"
                + "<div class='sagasuWindow'>" 
                    + "<div class='sagasuWindowUserIcon'>"
                        + "<img class='sagasuWindowUserIcon' src=" + ItemArray[i].imagePath + ">"
                    + "</div>"
                    + "<div class='sagasuWindowUserName'>"
                        + "SC太郎"
                    + "</div>"
                    + "<div class='sagasuWindowGood'>"
                        + "<img class='sagasuWindowGood' src='image/good.png' alt='いいね'>"
                    + "</div>"
                    + "<div class='sagasuWindowGoodCnt'>"
                        + "<div id='GoodCnt'></div>"
                    + "</div>"
                    + "<div class='sagasuWindowBad'>"
                        + "<img class='sagasuWindowBad' src='image/Bad.png' alt='いいね'>"
                    + "</div>"
                    + "<div class='sagasuWindowBadCnt'>"
                        + "<div id='BadCnt'></div>"
                    + "</div>"
                    + "<div class='sagasuWindowCategory'>"
                        + "【カテゴリ】" + getCategoryName(ItemArray[i].categoryID)
                    + "</div>"
                    + "<div class='sagasuWindowDeadTime'>"
                        + "【期限】" + ItemArray[i].deadTime 
                    + "</div>"
                    + "<div class='sagasuWindowComment'>"
                        + ItemArray[i].StoreComment 
                    + "</div>"


                + "</div>" // 吹き出しに表示する内容
        });

        /* マーカーをクリックしたら場所の詳細を表示 */
        google.maps.event.addListener(sagasuMarkers[i], 'click', openSagasuMarkerWindowLap);
        
        if(IsInTheWindow(swLatlng,neLatlng,sagasuMarkers[i].position) == true){
            // 画面内の場合、デフォルトで吹き出しを表示
            // sagasuInfoWindows[i].open(map, sagasuMarkers[i]);
        }

        // 後で必要な情報を作成
        sagasuInf[i] = new classSagasuInf(ItemArray[i].deadTime);
        // console.log('マーカーの中身',sagasuMarkers[i]);
    }

    ViewHeatMap();
    if(IsSagasuMarkerInTheWindow == false){
        alert("現在の表示範囲に検索データはありません。");
    }    
}
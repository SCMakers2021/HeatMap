class classSagasuInf {
    constructor(deadTime) {
      this.deadTime = deadTime;
    }
  }
var sagasuMarkers=[];
var sagasuInfoWindows =[];
var sagasuInf=[];

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
    sagasuInfoWindows[index].open(map, sagasuMarkers[index]);
}

// サガスマーカーを非表示
function hiddenSagasuMarker(index){
    sagasuMarkers[index].setVisible(false);
    sagasuInfoWindows[index].close();
}

function openSagasuMarker(e){
    var ClickIndex=0;
    // どれがクリックされたかを判断
    sagasuMarkers.forEach(function(elem, index) {
        if(elem.position.lat() == e.latLng.lat() && elem.position.lng() == e.latLng.lng()) {  
        ClickIndex = index;
        }else{
        // 違うのは閉じる
        sagasuInfoWindows[index].close();
        }
    });
    
    //クリックしたマーカーの詳細を表示
    sagasuInfoWindows[ClickIndex].open(map, sagasuMarkers[ClickIndex]);
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

    for (var i = 0; i < ItemArray.length; i++){
        // console.log('要素: %d 緯度：%s',i,ItemArray[i].lat);
        pos = {
            lat: Number(ItemArray[i].lat), // 緯度
            lng: Number(ItemArray[i].lng) // 経度
        };
        sagasuMarkers[i] = new google.maps.Marker({
                position: pos,
                map: map,
                animation: google.maps.Animation.DROP // マーカーを立つときのアニメーション
            });

        if(true == isSmartPhone()){
            height = 50;
        }else{
            height = 200;
        }
        sagasuInfoWindows[i] = new google.maps.InfoWindow({ // 吹き出しの追加
        content: "<div class='sample'>" 
                    + "<div>"
                        + "期限" + ItemArray[i].deadTime 
                    + "</div>"
                    + "<div>"
                        + "投稿コメント" + ItemArray[i].StoreComment 
                    + "</div>"
                    + "<div>"
                        // + "<input type='image' src=" + ItemArray[i].imagePath + " alt='押してケロ♪'>"
                        + "<img id='upldPreview' src=" + ItemArray[i].imagePath + " height = " + height + ">"
                    + "</div>"
                + "</div>" // 吹き出しに表示する内容
        });

        /* マーカーをクリックしたら場所の詳細を表示 */
        google.maps.event.addListener(sagasuMarkers[i], 'click', openSagasuMarker);
        
        if(IsInTheWindow(swLatlng,neLatlng,sagasuMarkers[i].position) == true){
            // 画面内の場合、デフォルトで吹き出しを表示
            sagasuInfoWindows[i].open(map, sagasuMarkers[i]);
        }

        // 後で必要な情報を作成
        sagasuInf[i] = new classSagasuInf(ItemArray[i].deadTime);
        // console.log('マーカーの中身',sagasuMarkers[i]);
    }
}
var sagasuMarkers=[];
var sagasuInfoWindows =[];

function  ClearSagasuMarker(){
    if(sagasuMarkers[0] != null){
        sagasuMarkers.forEach(function(elem, index) {
            elem.setMap(null);
        });
    }

    sagasuMarkers=[];
    sagasuInfoWindows =[];
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
    
//マーカーを立てる
function setSagasuMarker(ItemArray){
    for (var i = 0; i < ItemArray.length; i++){
        console.log('要素: %d 緯度：%s',i,ItemArray[i].lat)
        var pos = {
            lat: Number(ItemArray[i].lat), // 緯度
            lng: Number(ItemArray[i].lng) // 経度
            };
            sagasuMarkers[i] = new google.maps.Marker({
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP // マーカーを立つときのアニメーション
            });

            sagasuInfoWindows[i] = new google.maps.InfoWindow({ // 吹き出しの追加
            content: '<div class="sample">サンプル</div>' // 吹き出しに表示する内容
        });

        /* マーカーをクリックしたら場所の詳細を表示 */
        google.maps.event.addListener(sagasuMarkers[i], 'click', openSagasuMarker);
        console.log('マーカーの中身',sagasuMarkers[i]);
    }
}
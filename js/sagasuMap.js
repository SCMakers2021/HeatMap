class classSagasuInf {
    constructor(deadTime,UserID) {
      this.deadTime = deadTime;
      this.UserID = UserID;
    }
  }
var sagasuMarkers=[];
var sagasuInfoWindows =[];
var sagasuInf=[];
var sagasuUserInf=[];
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
    // console.log(ClickIndex);
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

// 後で使う必要な情報を先にまとめる
function MakeSagasuInfList(ItemArray){
    // サガスのリストからUserIDのみ抜き出す
    ItemArray.forEach(function(elem, index) {
        // 後で必要な情報を作成
        sagasuInf[index] = new classSagasuInf(elem.deadTime,elem.UserID);
        // console.log('マーカーの中身',sagasuMarkers[i]);
    });
}

// 期限間近かを判定
function IsDeadLineApproaching(deadTime){
    var now = new Date();
    var deadTimeDate = new Date(deadTime);  // 期限
    //差日を求める（86,400,000ミリ秒＝１日）
    var termDay = (deadTimeDate - now) / 86400000;
    // console.log(`deadTimeDate：${deadTimeDate}　termDay：${termDay}`);
    // 前後1.5日くらいにしておく(GMTの関係でちょっと誤差が出る)
    if((-1.5 <= termDay)&&(termDay<=1.5)){
        return true;
    }else{
        return false;
    }
}

//マーカーを立てる
function setSagasuMarker(ItemArray){
    var height;
    var width;
    var pos;
    var latlngBounds = map.getBounds();
    var swLatlng = latlngBounds.getSouthWest();
    var neLatlng = latlngBounds.getNorthEast();

    /* マーカーのアイコンの設定 */
    var markerImage;
    var animation;
    var markerLabel;

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
        if(IsDeadLineApproaching(ItemArray[i].deadTime) == true){
            animation = google.maps.Animation.BOUNCE;   // 期限切れ間近は目立たせる
            markerLabel = {
                text: `【期限】${ItemArray[i].deadTime}` ,
                color: "red" ,
                fontSize: "20px" ,
            };
        }else{
            animation = google.maps.Animation.DROP;
            markerLabel = "";
        }
        sagasuMarkers[i] = new google.maps.Marker({
                position: pos,
                map: map,
                icon: markerImage,
                // label: markerLabel,
                title: `【期限】${ItemArray[i].deadTime}`,
                animation: animation // マーカーを立つときのアニメーション
            });
        // マーカーにマウスを乗せたときにウィンドウを表示
        google.maps.event.addListener(sagasuMarkers[i], 'mouseover', openSagasuMarkerWindowLap);
        // google.maps.event.addListener(sagasuMarkers[i], 'mouseout', closeSagasuMarkerWindow);

        if(true == isSmartPhone()){
            height = 50;
            width = 250;
        }else{
            height = 200;
            width = 400;
        }

        sagasuInfoWindows[i] = new google.maps.InfoWindow({ // 吹き出しの追加
        content:  "<div class='sagasuWindow'>"
                    + `<div>`
                        + `<a href=${sagasuUserInf[sagasuInf[i].UserID].userLink} target="_blank">`
                        + `<img id='SagasuInfoWindow' src=${ItemArray[i].imagePath} class='sagasuWindowPic' alt='投稿者のページを開く' title='投稿者のページを開く'>`
                        + "</a>"
                    + "</div>"
                    + "<div class='sagasuWindowGrid'>" 
                        + "<div class='sagasuWindowUserIcon'>"
                            + `<img class='sagasuWindowUserIcon' src=${sagasuUserInf[sagasuInf[i].UserID].iconPath}>`
                        + "</div>"
                        + "<div class='sagasuWindowUserName'>"
                            + `【投稿者　】${sagasuUserInf[sagasuInf[i].UserID].userName}`
                        + "</div>"
                        + "<div class='sagasuWindowCategory'>"
                            + "【カテゴリ】" + getCategoryName(ItemArray[i].categoryID)
                        + "</div>"
                        + "<div class='sagasuWindowDeadTime'>"
                            + `【期限　　】${ItemArray[i].deadTime}`
                        + "</div>"
//                        + "<div class='sagasuWindowGood'>"
//                           + "<img class='sagasuWindowGood' src='image/good.png' alt='いいね'>"
                        + "<div class='sagasuWindowGood'>"
                           + "<button id='sagasuGoodclick'><img class='sagasuWindowGood' src='image/good.png' alt='いいね'></button>"
                        + "</div>"
                        + "<div class='sagasuWindowGoodCnt'>"
                            + `<div id='GoodCnt'>${sagasuUserInf[sagasuInf[i].UserID].repPlus}</div>`
                        + "</div>"
//                        + "<div class='sagasuWindowBad'>"
//                            + "<img class='sagasuWindowBad' src='image/bad.png' alt='いいね'>"
                        + "<div class='sagasuWindowBad'>"
                            + "<button id='sagasuBadclick'><img class='sagasuWindowBad' src='image/bad.png' alt='いいね'></button>"                      
                        + "</div>"
                        + "<div class='sagasuWindowBadCnt'>"
                            + `<div id='BadCnt'>${sagasuUserInf[sagasuInf[i].UserID].repMinus}</div>`
                        + "</div>"
                        + "<div class='sagasuWindowUserLink'>"
                            // + `【投稿者リンク】${sagasuUserInf[sagasuInf[i].UserID].userLink}`
                            + `<a href=${sagasuUserInf[sagasuInf[i].UserID].userLink} target="_blank" class="btn02 rotateback">`
                            + "<span><img src='image/Orion_external-link.png' class='sagasuWindowUserLink' '></span>"
                            + `<span><img src='image/Orion_external-link_solid.png' class='sagasuWindowUserLink' alt='投稿者のページを開く' title='投稿者のページを開く'></span></a>`
                            + "</a>"
                        + "</div>"
                        + "<div class='sagasuWindowComment'>"
                            + ItemArray[i].StoreComment 
                        + "</div>"
                    + "</div>"
                + "</div>", // 吹き出しに表示する内容
            // maxWidth: width
        });
        //Good評価した時の処理
        sagasuInfoWindows[i].addListener('domready', () => {
            document.getElementById('sagasuGoodclick').addEventListener('click', () => {
                GoodClick();
            });
        });
        //Bad評価した時の処理
        sagasuInfoWindows[i].addListener('domready', () => {
            document.getElementById('sagasuBadclick').addEventListener('click', () => {
                BadClick();
            });
        });

        /* マーカーをクリックしたら場所の詳細を表示 */
        google.maps.event.addListener(sagasuMarkers[i], 'click', openSagasuMarkerWindowLap);
        
        if(IsInTheWindow(swLatlng,neLatlng,sagasuMarkers[i].position) == true){
            // 画面内の場合、デフォルトで吹き出しを表示
            // sagasuInfoWindows[i].open(map, sagasuMarkers[i]);
        }
    }

    ViewHeatMap();
    if(IsSagasuMarkerInTheWindow == false){
        alert("現在の表示範囲に検索データはありません。");
    }    
}

function GoodClick(){
    window.alert('Good');
}

function BadClick(){
    window.alert('Bad');
}

// サガス情報をもとにユーザ情報を検索
function MakeSQLSagasuUserList(){
    var UserListDuplicate=[];   // 重複ありのリスト
    // サガスのリストからUserIDのみ抜き出す
    sagasuInf.forEach(function(elem, index) {
        UserListDuplicate.push(elem.UserID);
    });

    // 重複なしのリストにする
    const UserListNonDuplicate = Array.from(new Set(UserListDuplicate));
    var sql = `SELECT userID,iconPath,repMinus,repPlus,userLink,userName `
            + `FROM HeatMapUserInfo `;
            UserListNonDuplicate.forEach(function(elem, index) {
                if(index==0){
                    sql = sql + `WHERE userID = '${elem}' `;
                }else{
                    sql = sql + `OR userID = '${elem}' `;
                }
            });
    return sql;
}

function AddUserInfToSagasuInfList(itemArray){
    // 連想配列でユーザIDのリストを作成
    sagasuUserInf=[];
    // サガスのリストからUserIDのみ抜き出す
    itemArray.forEach(function(elem){
        // 後で必要な情報を作成
        sagasuUserInf[elem.userID] = elem;
    });
    // console.log("sagasuUserInf：");
    // console.log(sagasuUserInf);
}
class classSagasuInf {
    constructor(deadTime,UserID) {
      this.deadTime = deadTime;
      this.UserID = UserID;
      this.IsGoodBtnOn = false;
      this.IsBadBtnOn = false;
    }
  }
var sagasuMarkers=[];
var sagasuInfoWindows =[];
var sagasuInf=[];
var sagasuInfArray;
var sagasuUserInf=[];
var IsSagasuMarkerInTheWindow = false;

// サガスマーカーを非表示にする
function SetMapSagasuMarker(){
    if(sagasuMarkers[0] != null){
        sagasuMarkers.forEach(function(elem, index) {
            elem.setMap(null);
        });
    }
}

// サガスマーカーをすべてクリア
function  ClearSagasuMarker(){
    // サガスマーカーを非表示にする
    SetMapSagasuMarker();

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
    var ClickFlg = false;
    // どれがクリックされたかを判断
    sagasuMarkers.forEach(function(elem, index) {
        if(elem.position.lat() == lat && elem.position.lng() == lng) {  
            ClickIndex = index;
            ClickFlg = true;
        }else{
        // 違うのは閉じる
        sagasuInfoWindows[index].close();
        }
    });
    // console.log(ClickIndex);
    //クリックしたマーカーの詳細を表示
    if(ClickFlg == true){
        sagasuInfoWindows[ClickIndex].open(map, sagasuMarkers[ClickIndex]);
    }
}

// 指定したindexのマーカーに移動し、吹き出しを表示
function MoveMarkerAndOpenInfoWindow(index){
    // マーカーに移動
    map.panTo(sagasuMarkers[index].position);

    var lat = sagasuMarkers[index].position.lat();
    var lng = sagasuMarkers[index].position.lng();
    // 吹き出しを表示
    openSagasuMarkerWindow(lat,lng);
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
    sagasuInfArray = [];    // 初期化
    sagasuInfArray = ItemArray;
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

// 評価をインクリメント
function AddGoodBadButton(GoodBad,index,num){
    let targArea = document.getElementById(`${GoodBad}Cnt${index}`);
    var Cnt = Number(targArea.innerHTML);
    targArea.innerHTML = Cnt + num;
}

// ボタンの選択状態を切り替え
function SwitchGoodBadButton(GoodBad,index){
    let targButton = document.getElementById(`sagasu${GoodBad}click${index}`);
    var activeClass = `sagasuWindow${GoodBad}-active`;
    var negativeClass = `sagasuWindow${GoodBad}-negative`;
    // activeかを判定
    if(targButton.classList.contains(activeClass)){
        // あったら削除
        targButton.classList.remove(activeClass);
        // negativeを追加
        targButton.classList.add(negativeClass);
        AddGoodBadButton(GoodBad,index,-1);
    }else{
        // activeを追加
        targButton.classList.add(activeClass);
        // negativeを削除
        targButton.classList.remove(negativeClass);
        // ボタンを押す
        AddGoodBadButton(GoodBad,index,1);
        if(GoodBad=="Good"){
            if(sagasuInf[index].IsGoodBtnOn == false){
                UpdateUserReputation(sagasuInf[index].UserID,1);
                sagasuInf[index].IsGoodBtnOn = true;
            }
        }else{
            if(sagasuInf[index].IsBadBtnOn == false){
                UpdateUserReputation(sagasuInf[index].UserID,-1);
                sagasuInf[index].IsBadBtnOn = true;
            }
        }
    }
}

// 検索結果を使用して、再描画（スライダーで表示する/しないを切り替えるため）
function setSagasuMarkerForSliderChange(ItemArray){
    if(sagasuInfArray.length != 0){
        // マーカーを非表示にする
        SetMapSagasuMarker();
        // マーカーを再設定
        setSagasuMarker(sagasuInfArray);
    }else{
        SagasuSidebarAlert("検索結果は0件です");
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
        SagasuSidebarAlert("検索結果は0件です");
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
        google.maps.event.addListener(sagasuMarkers[i], 'click', openSagasuMarkerWindowLap);
        //google.maps.event.addListener(sagasuMarkers[i], 'mouseover', openSagasuMarkerWindowLap);
        //google.maps.event.addListener(sagasuMarkers[i], 'mouseout', closeSagasuMarkerWindow);

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
                            + `【カテゴリ】${getCategoryName(ItemArray[i].categoryID)}`
                        + "</div>"
                        + "<div class='sagasuWindowDeadTime'>"
                            + `【期限　　】${ItemArray[i].deadTime}`
                        + "</div>"
                        + `<div id='sagasuGoodclick${i}' class='sagasuWindowGood sagasuWindowGood-negative' onclick='SwitchGoodBadButton("Good",${i})' title='好評価'>`
                        + "</div>"
                        + `<div class='sagasuWindowGoodCnt'>`
                            + `<div id='GoodCnt${i}'>${sagasuUserInf[sagasuInf[i].UserID].repPlus}</div>`
                        + "</div>"
                        + `<div id='sagasuBadclick${i}' class='sagasuWindowBad sagasuWindowBad-negative' onclick='SwitchGoodBadButton("Bad",${i})' title='低評価'>`
                        + "</div>"
                        + `<div class='sagasuWindowBadCnt'>`
                            + `<div id='BadCnt${i}'>${sagasuUserInf[sagasuInf[i].UserID].repMinus}</div>`
                        + "</div>"
                        + "<div class='sagasuWindowUserLink'>"
                            // + `【投稿者リンク】${sagasuUserInf[sagasuInf[i].UserID].userLink}`
                            + `<a href=${sagasuUserInf[sagasuInf[i].UserID].userLink} target="_blank" class="btn02 rotateback">`
                            + "<span><img src='image/Orion_external-link.png' class='sagasuWindowUserLink' '></span>"
                            + `<span><img src='image/Orion_external-link_solid.png' class='sagasuWindowUserLink' alt='投稿者のページを開く' title='投稿者のページを開く'></span></a>`
                            + "</a>"
                        + "</div>"
                        + "<textarea class='sagasuWindowComment'>"
                            + ItemArray[i].StoreComment 
                        + "</textarea>"
                    + "</div>"
                + "</div>", // 吹き出しに表示する内容
            // maxWidth: width
        });

        /* マーカーをクリックしたら場所の詳細を表示 */
        google.maps.event.addListener(sagasuMarkers[i], 'click', openSagasuMarkerWindowLap);
        
        if(IsInTheWindow(swLatlng,neLatlng,sagasuMarkers[i].position) == true){
            // 画面内の場合、デフォルトで吹き出しを表示
            // sagasuInfoWindows[i].open(map, sagasuMarkers[i]);
        }
    }

    // ヒートマップを表示
    ViewHeatMap();
    // サイドバーにサガスの検索結果を表示する
    if(false == isSmartPhone()){
        MakeSagasuSidebarSearchList(ItemArray);
    }
    if(IsSagasuMarkerInTheWindow == false){
        SagasuSidebarAlert("現在の表示範囲に検索データはありません。");
    }    
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

// サイドバー用メッセージ
// スマホならアラートで通知するが、ブラウザなら検索結果の一覧に記載する
function SagasuSidebarAlert(message){
    if(isSmartPhone()==true){
        alert(message);
    }else{
        var SearchListArea = document.getElementById("sidebarSearchList");
        SearchListArea.innerHTML = `<div  class='SearchResult'>${message}</div>`;
    }
}

// サイドバーに検索結果の一覧を追加する。
function MakeSagasuSidebarSearchList(ItemArray){
    var SearchListArea = document.getElementById("sidebarSearchList");
    // まず空にする
    SearchListArea.innerHTML = "";
    // スライドバーの表示日数分後の日付を取得する
    var value = GetSlidbarValue();
    var searchTime = GetNdayAfterDate(value);
    //　ループでリストを生成し、まとめて追加する
    var li = [];
    var cnt=0;
    for (var i = 0; i < ItemArray.length; i++){
        // 期限切れじゃないものだけをリストに追加
        if(false == IsTimeOutDeadTime(searchTime,sagasuInf[i].deadTime)){
            li.push(getSearchList1DivStr(ItemArray[i],i));
            cnt++;
        }
    }

    if(li.length != 0){
        // UTCとローカルタイムゾーンとの差を取得し、分からミリ秒に変換
        const diff = searchTime.getTimezoneOffset() * 60 * 1000    // -540 * 60 * 1000 = -32400000

        // toISOString()で、UTC時間になってしまう（-9時間）ので、日本時間に9時間足しておく
        const plusLocal = new Date(searchTime - diff)
        var formattedDate = plusLocal.toISOString().split("T")[0];
        var result = `<div class='SearchResult'>${formattedDate}までの検索結果は${cnt}件です。</div>`
        SearchListArea.innerHTML = result + li.join("");
    }else{
        SagasuSidebarAlert("現在の表示範囲に検索データはありません。");
    }
    console.log(`li.length：${li.length} searchTime:${searchTime} formattedDate:${formattedDate}`);
}

// 検索結果の一覧を1要素追加する。
function getSearchList1DivStr(item,i){
    var ret = `<div class='SearchListGrid' onclick='MoveMarkerAndOpenInfoWindow(${i})'>`
                + "<div class='SearchListUserName'>"
                    + `${sagasuUserInf[sagasuInf[i].UserID].userName}`
                + "</div>"
                + "<div class='SearchListCategoryPic'>"
                    + `<img class='SearchListCategoryPic' src='${getCategoryPath(item.categoryID)}'>`
                + "</div>"
                // + "<div class='SearchListCategoryName'>"
                //     + `${getCategoryName(item.categoryID)}`
                // + "</div>"
                + "<div class='SearchListGood'>"
                    + "<img class='sagasuWindowGood' src='image/good.png' alt='いいね'>"
                + "</div>"
                + "<div class='SearchListGoodCnt'>"
                + `<div id='GoodCnt'>${sagasuUserInf[sagasuInf[i].UserID].repPlus}</div>`
                + "</div>"
                + "<div class='SearchListDeadTime'>"
                    + `${item.deadTime}まで`
                + "</div>"
                + `<div class='SearchListPic'>`
                    + `<img src=${item.imagePath} class='SearchListPic'>`
                + "</div>"
            + `</div>`;
    return ret;
}



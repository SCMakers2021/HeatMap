var IsTresureHuntMode = false;
var TreasureInf;
const TreasureMaxNum = 5;
// 経度,緯度の順番
const TreasureList = [
  ["マゼランの秘宝",
  "1519年スペイン王の信任を得てスペイン船5隻の艦隊を率いてスペイン・セビリアを出発したマゼランは南アメリカ大陸南端のマゼラン海峡を発見して太平洋に到達し、マゼランは途中1521年フィリピンで戦死したが、残された艦隊が1522年に史上初めての世界一周を達成した",
  135.3637933731079,34.75617559462766],
  ["リマの秘宝",
  "コスタリカ沖にある、ココ島別名ココス島には300億円相当の宝があるといううわさがある。この財宝はカトリック教会がひそかに隠し持っていたものだ。教会側は、スペインの植民地化が収まるまで、ウィリアム・トンプソンという男に、船に乗せて預けた。しかし宝の魅力に抗えなくなったトンプソンは、手下とともに、宝をココス島の奥地に隠した。騒動が落ち着いた頃、また取りに行こうという算段だったが、不運にもスペインの役人に捕縛されてしまう。本来なら死刑のところ、宝のありかを教えるという話で特赦をもらったトンプソンは、ジャングルにつくや否や逃走し、宝のありかもわからなくなった。",
  -87.06673622131348,5.533380097561142],
  ["草薙の剣",
  "この剣は、日本の神話の三種の神器の一つである。天皇の持つ武力の象徴とされていた。江戸時代の神官が神剣を盗み見たとの記録があり、それによれば長さは2尺8寸（およそ85センチ）ほどで、刃先は菖蒲の葉に似ており、全体的に白っぽく、錆はなかったとある。神剣を見た神官は祟りで亡くなったとの逸話も伝わっている。  　神話によると、熱田神宮に安置されていることになっているが、本物は水没したとされている。形代の方は、現在皇居の「剣璽の間」に勾玉とともに安置されている。",
  136.90836489200592,35.12669625351328],
  ["悲しき夜の秘宝",
  "1520年、エルナン・コルテスが、アステカ、ティノティトランにて征服の途中、激怒したアステカ人による反乱・暴動にあい、自軍のスペイン兵を失い退却した。その際に彼が置いていった戦利品の宝は、アステカ人がスペイン人の目をくらますため丘の周りに埋めたとされている。コルテスが軍を率いて戻ってきた際、生き残った人たちに宝について尋ねたが、手掛かりは何一つつかめなかった。どこかにまだ、あの秘宝は眠っているのだ。",
  -98.05416104941406,19.274085101783506],
  ["古代エジプトの秘宝",
  "古代エジプト時代の紀元前1333年頃に即位したツタンカーメン王はアメン信仰を復活させ、アマルナを放棄してテーベへと首都を戻した。時を経て19世紀、考古学者により王家の谷にてツタンカーメンの黄金のマスクが発掘された。",
  31.11976146697998,29.994377505778218],
];

class classTreasure{
  constructor(name,detail,x,y){
    this.Name=name;
    this.Detail=detail;
    this.x=x;
    this.y=y;
  }
}

class classTreasureHunt {
  constructor() {
    this.isGetArray = Array(TreasureMaxNum);
    this.isGetArray.fill(false);
    this.itemNum = 0;
    this.treasure = new classTreasure("","",0,0);
    this.targetID = 0;  // 現在選択中のお宝のID
  }

  consoleLog(){
    console.log(`itemNum：${this.itemNum}`,`Name：${this.treasure.Name}`,`x:${this.treasure.x}`,`y：${this.treasure.y}`,);
  }
}



// 宝探しを選択
function TreasureHuntFunc(treasureNum){
  // 開始していなければ開始
  if(false == IsTresureHuntMode){
    TreasureHuntStart();
  }

	var message = TreasureList[treasureNum][1];
  alert(message);
  TreasureInf.treasure = new classTreasure(TreasureList[treasureNum][0],TreasureList[treasureNum][1],TreasureList[treasureNum][2],TreasureList[treasureNum][3]);
  TreasureInf.targetID = treasureNum;
  setTreasureMarker(TreasureInf.treasure);
}

// 宝探しを開始
function TreasureHuntStart(){
  IsTresureHuntMode = true;
  TreasureInf = new classTreasureHunt();
  // ボタンを変更
  ChgAmariButton();
}

// 宝探し終了
function TreasureHuntEnd(){
  IsTresureHuntMode = false;
  // ボタンを変更
  ChgAmariButton();
}

// 宝探しを実行
function SearchTresure(){
  console.log(`IsTresureHuntMode：${IsTresureHuntMode}`);
  TreasureInf.consoleLog();
  // ヒートマップを表示
  ViewTreasureHeatMap(); 
}

//お宝のマーカーを立てる
function setTreasureMarker(treasure){
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

  // 初期化しておく
  ClearSagasuMarker();
  // ヒートマップもクリア
  ClearHeatMap();

  for (var i = 0; i < 1; i++){
      pos = {
          lat: Number(treasure.y), // 緯度
          lng: Number(treasure.x) // 経度
      };
      markerImage = {
          url: 'treasureHunt/image/takara.png', //画像のURL
          size: new google.maps.Size(64, 64), //サイズ
          scaledSize: new google.maps.Size(64, 64) //アイコンのサイズ
      };

      animation = google.maps.Animation.BOUNCE;
      markerLabel = "";

      sagasuMarkers[i] = new google.maps.Marker({
              position: pos,
              map: map,
              icon: markerImage,
              // label: markerLabel,
              // title: `【期限】${ItemArray[i].deadTime}`,
              animation: animation // マーカーを立つときのアニメーション
          });

      // 地図を縮小しすぎている場合、マーカーを表示しないようにする
      UpdateTreasureDisplay(sagasuMarkers[i]);
      if(true == isSmartPhone()){
          height = 50;
          width = 250;
      }else{
          height = 200;
          width = 400;
      }

      sagasuInfoWindows[i] = new google.maps.InfoWindow({ // 吹き出しの追加
      content:  `<div class='treasureWindowGrid'>`
                    + `<div id='treasureButton' class='treasureGetButton treasureGetButton-negative' onclick='ClickTreasureButton()' title='お宝ゲット'>`
                    + "</div>"
                  + `<div class='treasureTitle'>`
                      + ` 【${TreasureInf.treasure.Name}】 `
                  + "</div>"
                  + `<div class='treasureDetail'>`
                      + TreasureInf.treasure.Detail
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
}

// お宝ボタンをクリック
function ClickTreasureButton(){
  let targButton = document.getElementById(`treasureButton`);
  var activeClass = `treasureGetButton-active`;
  var negativeClass = `treasureGetButton-negative`;
  // activeかを判定
  if(targButton.classList.contains(activeClass)){
      // あったら削除
      targButton.classList.remove(activeClass);
      // negativeを追加
      targButton.classList.add(negativeClass);
      // AddGoodBadButton(GoodBad,index,-1);
  }else{
      // activeを追加
      targButton.classList.add(activeClass);
      // negativeを削除
      targButton.classList.remove(negativeClass);
      // ボタンを押す
      GetTreasure();
      // if(GoodBad=="Good"){
      //     if(sagasuInf[index].IsGoodBtnOn == false){
      //         UpdateUserReputation(sagasuInf[index].UserID,1);
      //         sagasuInf[index].IsGoodBtnOn = true;
      //     }
      // }else{
      //     if(sagasuInf[index].IsBadBtnOn == false){
      //         UpdateUserReputation(sagasuInf[index].UserID,-1);
      //         sagasuInf[index].IsBadBtnOn = true;
      //     }
      // }
  }
}

function ViewTreasureHeatMap(){  
  return new Promise(function(resolve,reject) {
    var latlngBounds = map.getBounds();
    var swLatlng = latlngBounds.getSouthWest();
    var swlat = swLatlng.lat();
    var swlng = swLatlng.lng();

    var neLatlng = latlngBounds.getNorthEast();
    var nelat = neLatlng.lat();
    var nelng = neLatlng.lng();

    var latRangeOver = nelat;  // 緯度の上限(上の線)
    var latRangeUnder = swlat;  // 緯度の下限(下の線)
    var lngRangeOver = nelng;  // 経度の上限(右の線)
    var lngRangeUnder = swlng;  // 経度の下限(左の線)
    
    var latBlock = (latRangeOver - latRangeUnder)/row;  // 1ブロックの緯度の大きさ
    var lngBlock = (lngRangeOver - lngRangeUnder)/col;  // 1ブロックの経度の大きさ(正方形にするためには必要ないと思う)
    
    var latBlockOver;  // ブロックの緯度の上限
    var latBlockUnder;  // ブロックの緯度の下限
    var lngBlockOver;  // ブロックの経度の上限
    var lngBlockUnder;  // ブロックの経度の下限
    
    var cnt = new Array(col);
    for (var i = 0; i < cnt.length; i++){
      cnt[i] = new Array(row).fill(0);
    }
    
    var lat;
    var lng;
    
    var latDiff,lngDiff;
    var latindex,lngindex;
    
    // var searchTime = GetNdayAfterDate(dateNum);
    IsSagasuMarkerInTheWindow = false;

    for(var k = 0; k < sagasuMarkers.length; k++){
      lat = sagasuMarkers[k].position.lat();
      lng = sagasuMarkers[k].position.lng();
      
      latdiff = lat - latRangeUnder;
      lngdiff = lng - lngRangeUnder;

      latindex = Math.floor(latdiff/latBlock);
      lngindex = Math.floor(lngdiff/lngBlock);
      //console.log('要素: %d 緯度：%s 経度：%s latindex：%d lngindex：%d ',k,lat,lng,latindex,lngindex);
      
      // // 期限切れは除外
      // if(false == IsTimeOutDeadTime(searchTime,sagasuInf[k].deadTime)){
        if((0<=latindex)&&(latindex<row)
          &&(0<=lngindex)&&(lngindex<col)){
            cnt[lngindex][latindex] = cnt[lngindex][latindex] + 5;
            IsSagasuMarkerInTheWindow = true;
            // マーカーを見えるようにする
            UpdateTreasureDisplay(sagasuMarkers[k]);
          }
          // 枠外の時はなんでもいいのでマーカーはいじらない
      // }else{
      //   //マーカーを見えなくする
      //   hiddenSagasuMarker(k);
      // }
    }

    // お宝専用処理。範囲内に一つもデータがない場合、
    if(IsSagasuMarkerInTheWindow == false){
      var TreasureDirection;
      var imgRotateDegree;  // 画像の回転角度。→の図を用意しているため、→を0°としている。右回りがプラス。
      // お宝の方向を判定する
      if(latRangeOver<=lat){
        // 緯度の上限より小さい場合、↖↑↗の3パターン。
        if(lngRangeOver<=lng){
          //右の線より大きい場合は↗
          TreasureDirection = google.maps.ControlPosition.TOP_RIGHT;
          imgRotateDegree = -45;
        }else if(lng<=lngRangeUnder){
          //左の線より小さい場合は↖
          TreasureDirection = google.maps.ControlPosition.TOP_LEFT;
          imgRotateDegree = -135;
        }else{
          TreasureDirection = google.maps.ControlPosition.TOP_CENTER;
          imgRotateDegree = -90;
        }
      }else if(lat<=latRangeUnder){
        // 緯度の下の線より小さい場合、↙↓↘の3パターン。
        if(lngRangeOver<=lng){
          //右の線より大きい場合は↘
          TreasureDirection = google.maps.ControlPosition.BOTTOM_RIGHT;
          imgRotateDegree = 45;
        }else if(lng<=lngRangeUnder){
          //左の線より小さい場合は↙
          TreasureDirection = google.maps.ControlPosition.BOTTOM_LEFT;
          imgRotateDegree = 135;
        }else{
          TreasureDirection = google.maps.ControlPosition.BOTTOM_CENTER;
          imgRotateDegree = 90;
        }
      }else{
        // ←→の2パターン。
        if(lngRangeOver<=lng){
          //右の線より大きい場合は→
          TreasureDirection = google.maps.ControlPosition.RIGHT_CENTER;
          imgRotateDegree = 0;
        }else{
          TreasureDirection = google.maps.ControlPosition.LEFT_CENTER;
          imgRotateDegree = 180;
        }
      }
      AddArrowTreasureDirection(TreasureDirection,imgRotateDegree);
    }
    
    // データを再生成してHeatMapを更新(件数のカウントが終わってから再生成する。)
    if(true == IsSagasuMarkerInTheWindow){
      // クリア
      ClearHeatMap();

      heatMapData = [];
      for(var i = 0; i < col; i++) {
        // ブロックの経度の上下限の代入
        lngBlockOver = lngRangeUnder + ((i+1) * lngBlock);
        lngBlockUnder = lngRangeUnder + (i * lngBlock);
        
        for(var j = 0; j < row; j++) {
          // ブロックの緯度の上下限の代入
          latBlockOver = latRangeUnder + ((j+1) * latBlock);
          latBlockUnder = latRangeUnder + (j * latBlock);
          
          temp = cnt[i][j];
          // if(temp>0){
            tempHeatMapData = {location: new google.maps.LatLng((latBlockOver+latBlockUnder)/2, (lngBlockOver+lngBlockUnder)/2), weight: temp};
            heatMapData.push(tempHeatMapData);
          // }
        }
      }

      // 個数によって色付け
      heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: map,
        radius:radius,
        gradient: ['rgb(80, 98, 255)','rgb(80, 255, 240)','rgb(255, 229, 80)', 'rgb(255, 80, 226)'],
        });

      // console.log("heatMapData：");
      // console.log(heatMapData);
    }
  });
};

// アマリボタンを変化させる
function ChgAmariButton(){
  if(true == IsTresureHuntMode) {
    $("#btnAmari").toggleClass("topModeChange-Amari",false);	// 通常のアマリボタンのCSSを削除
    $("#btnAmari").toggleClass("TreasureHunt-Amari",true);	// お宝モードに変更
    UpdateTreasureCnt();
  }else{
    $("#btnAmari").toggleClass("TreasureHunt-Amari",false);	// お宝モード削除
    $("#btnAmari").toggleClass("topModeChange-Amari",true);	// 元に戻す
    $("#btnAmari").html("アマリ");
  }
}

// お宝ゲット
function GetTreasure(){
  if(TreasureInf.isGetArray[TreasureInf.targetID]==false){
    TreasureInf.isGetArray[TreasureInf.targetID] = true;
    TreasureInf.itemNum = TreasureInf.itemNum + 1;
    UpdateTreasureCnt();
  }
}

// 右上のお宝カウンタを更新する
function UpdateTreasureCnt(){
  var cnt = TreasureInf.itemNum;
  var strHtml = `お宝×${cnt}`;
  for(i=0;i<cnt;i++){
    strHtml = strHtml + `<img src ='treasureHunt/image/takara.png' width="60" height="60">`
  }
  $("#btnAmari").html(strHtml);
}

// お宝の方向に矢印を配置
var IsSetArrow = false;
var PreArrowDirection;
function AddArrowTreasureDirection(TreasureDirection,imgRotateDegree){
    // 現在地ボタンのエレメントを作成
    const ArrowTreasureDirection = document.createElement("div");
    // ArrowTreasureDirection.classList.add("btnripple3");
    ArrowTreasureDirection.classList.add("FadeFrame");
    // ArrowTreasureDirection.classList.add("fadeout");
    AddArrowTreasureSub(ArrowTreasureDirection,imgRotateDegree);
  
    if(true == IsSetArrow){
      map.controls[PreArrowDirection].pop();
    }else{
      IsSetArrow = true;
    }

    //Google MAPS APIに作成したボタンを渡す
    PreArrowDirection = TreasureDirection;
    map.controls[TreasureDirection].push(ArrowTreasureDirection);
}

 // 受け取ったDivにimgタブとボタンとしての機能を割り当て
 function AddArrowTreasureSub(controlDiv,imgRotateDegree) {

  const controlUI = document.createElement("img");

  controlUI.classList.add("CurrentPositionButton");
  controlUI.setAttribute("src", "./treasureHunt/image/arrow_right.svg");
  controlUI.setAttribute("style", `transform: rotate(${imgRotateDegree}deg);transform-origin:right top;`);
  
  controlDiv.appendChild(controlUI);

  controlUI.addEventListener("click", () => {
    MoveNowPosition();
  });
}

// お宝のマーカーの表示を切り替える
function UpdateTreasureDisplay(sagasuMarker){
  var zoom = map.getZoom();
  if(zoom<15){
    sagasuMarker.setVisible(false);
  }else{
    sagasuMarker.setVisible(true);
  }
}
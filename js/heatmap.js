/* ヒートマップ機能の定義 */
var heatMarkers = [];
var row,col,radius;
if(true == isSmartPhone()){
  row = 10;
  col = 8;
  radius = 80;
}else{
  // ブラウザ
  row = 12;
  col = 24;
  radius = 120;
}
var heatMapData = [];
var heatmap = null;

$(function () {
  $('.single-slider').jRange({
    from: 0,
    to: 5,
    step: 1.0,
    scale: ["今日","１日後", "２日後", "３日後", "４日後", "５日後"],
    format: '%s',
    width: '90%',
    // theme: "theme-blue",
    showLabels: false,
    // snap: true,
    ondragend: function(e){
      ChangeHistory(e);
    },
    onbarclicked: function(e){
      ChangeHistory(e);
    }
  });
});

function ChangeHistory (value) {
  // dispDistribution(value);
  ViewHeatMap();

  // console.log("分布表示スライダー:"+value);
  // alert(value+"日前を表示");
}

function ClearHeatMap(){
  if(heatmap != null){
    heatmap.setMap(null);
  }
}

// ○日後の日付を取得
function GetNdayAfterDate(dateNum){
  var ndayDate = new Date();
  ndayDate.setDate(ndayDate.getDate() + dateNum);
  return ndayDate;
}

// 期限切れ判定
function IsTimeOutDeadTime(chkDate,deadTimeStr){
  var deadTime = new Date(deadTimeStr);
  if(chkDate <= deadTime){
    return false;
  }else{
    return true;
  }
}

function GetSlidbarValue(){
  var elements = document.getElementsByClassName("pointer-label high");
  var ret;
  if(isNaN(elements[0].innerHTML)){
    ret = 0;
  }else{
    ret = Number(elements[0].innerHTML);
  }
  return ret;
}

// 「分布表示ボタンを押した場合の処理」
function ViewHeatMap(){
  let element = document.getElementById('BunpuCheckBox');
  var bIsBunpuView = element.checked;
  // 分布のチェックボックスがＯＮの場合のみ描画
  if(bIsBunpuView){
    var value = GetSlidbarValue();
    // console.log("分布表示ボタン");
    dispDistribution(value);
  }else{
    // クリア
    ClearHeatMap();
  }
}

function dispDistribution(dateNum){  
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
    
    var searchTime = GetNdayAfterDate(dateNum);
    IsSagasuMarkerInTheWindow = false;

    for(var k = 0; k < sagasuMarkers.length; k++){
      lat = sagasuMarkers[k].position.lat();
      lng = sagasuMarkers[k].position.lng();
      
      latdiff = lat - latRangeUnder;
      lngdiff = lng - lngRangeUnder;

      latindex = Math.floor(latdiff/latBlock);
      lngindex = Math.floor(lngdiff/lngBlock);
      //console.log('要素: %d 緯度：%s 経度：%s latindex：%d lngindex：%d ',k,lat,lng,latindex,lngindex);
      
      // 期限切れは除外
      if(false == IsTimeOutDeadTime(searchTime,sagasuInf[k].deadTime)){
        if((0<=latindex)&&(latindex<row)
          &&(0<=lngindex)&&(lngindex<col)){
            cnt[lngindex][latindex] = cnt[lngindex][latindex] + 5;
            IsSagasuMarkerInTheWindow = true;
            // マーカーを見えるようにする
            visibleSagasuMarker(k);
          }
          // 枠外の時はなんでもいいのでマーカーはいじらない
      }else{
        //マーカーを見えなくする
        hiddenSagasuMarker(k);
      }
    }

    // cnt[5][5] = 10;
    
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
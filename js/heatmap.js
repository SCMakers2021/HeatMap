/* ヒートマップ機能の定義 */
var heatMarkers = [];
const row = 10;
const col = 24;
var heatMapData = [];
var heatmap = null;

$(function () {
  $('.single-slider').jRange({
    from: 0,
    to: 7,
    step: 1.0,
    scale: ["今日","１日前", "２日前", "３日前", "４日前", "５日前", "６日前", "７日前"],
    format: '%s',
    width: '90%',
    // theme: "theme-blue",
    showLabels: false,
    // snap: true,
    ondragend: function(e){
      ChangeHistory(e);
    }
  });
});

function ChangeHistory (value) {
  initHeatMarkers(value);
  dispDistribution();

  console.log("分布表示スライダー:"+value);
  // alert(value+"日前を表示");
}


function initHeatMarkers(value){
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
  
  var latBlock = (latRangeOver - latRangeUnder)/(row+10);  // 1ブロックの緯度の大きさ
  var lngBlock = (lngRangeOver - lngRangeUnder)/col;  // 1ブロックの経度の大きさ(正方形にするためには必要ないと思う)

  var center = map.getCenter();
  var latlng = new google.maps.LatLng(center.lat()-value*latBlock, center.lng()+value*lngBlock);
  console.log(latlng.lat());
  console.log(latlng.lng());
  heatMarkers = [
    {
      position: latlng
    }
  ];
}

function dispDistribution(){
  if(heatmap == null){
    initHeatMarkers(0);
  }
    
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
  
  if(heatmap != null){
    heatmap.setMap(null);
  }
  
  heatMapData = [];
  
  for(var i = 0; i < col; i++) {
    // ブロックの経度の上下限の代入
    lngBlockOver = lngRangeUnder + ((i+1) * lngBlock);
  	lngBlockUnder = lngRangeUnder + (i * lngBlock);
  	
  	for(var j = 0; j < row; j++) {
  	  // ブロックの緯度の上下限の代入
  	  latBlockOver = latRangeUnder + ((j+1) * latBlock);
  	  latBlockUnder = latRangeUnder + (j * latBlock);
  	  
  	  for(var k = 0; k < heatMarkers.length; k++){
  	    lat = heatMarkers[k].position.lat();
  	    lng = heatMarkers[k].position.lng();
  	    if((lat > latBlockUnder) && (lat <= latBlockOver)
  	    && (lng > lngBlockUnder) && (lng <= lngBlockOver)){
  	      cnt[i][j] = cnt[i][j] + 1;
  	    }
  	  }
  	  temp = cnt[i][j];
      if(temp>0){
        tempHeatMapData = {location: new google.maps.LatLng((latBlockOver+latBlockUnder)/2, (lngBlockOver+lngBlockUnder)/2), weight: temp};
        heatMapData.push(tempHeatMapData);
      }
  	}
  }

  console.log("heatMapData");
  console.log(heatMapData);
  // 個数によって色付け
  heatmap = new google.maps.visualization.HeatmapLayer({
   data: heatMapData,
   map: map,
   radius:50,
  });
};
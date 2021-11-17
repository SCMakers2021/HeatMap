/* ヒートマップ機能の定義 */
var heatMarkers = [];
const row = 10;
const col = 24;

function initHeatMarkers(){
  var center = map.getCenter();
  heatMarkers = [
  {
    position: center
  }
//  {
//    position: e.latLng,
//    title: '投稿',
//    summary: 'getMassage()',
//    figure: 'images/figure01.jpg'
//  }
  ];
}

function dispDistribution(){
//  heatMapData = [
    //{location: new google.maps.LatLng(marker.position.lat, marker.position.lng), weight: 0.5},
//    {location: marker.position, weight: 4},
//    {location: new google.maps.LatLng(35.43820870035895,139.27825203125), weight: 2},
//  ];
//  heatmap = new google.maps.visualization.HeatmapLayer({
//   data: heatMapData,
//   map: map,
//   radius:50,	// 各データ ポイントの影響の半径 (ピクセル単位)。
//  });
  
  initHeatMarkers();
  
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
  
  var heatMapData = [];
  
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
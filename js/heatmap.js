/* ヒートマップ機能の定義 */
var heatMarkers = [];

function initHeatMarkers(){
  heatMarkers = [
  {
    position: e.latLng,
    title: '投稿',
    summary: 'getMassage()',
    figure: 'images/figure01.jpg'
  },
  {
    position: e.latLng,
    title: '投稿',
    summary: 'getMassage()',
    figure: 'images/figure01.jpg'
  },
  {
    position: e.latLng,
    title: '投稿',
    summary: 'getMassage()',
    figure: 'images/figure01.jpg'
  }
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
  
  var latlngBounds = map.getBounds();
  var swLatlng = latlngBounds.getSouthWest();
  var swlat = swLatlng.lat();
  var swlng = swLatlng.lng();

  var neLatlng = latlngBounds.getNorthEast();
  var nelat = neLatlng.lat();
  var nelng = neLatlng.lng();

  var latRangeOver = swlat;  // 緯度の上限(左の線)
  var latRangeUnder = nelat;  // 緯度の下限(右の線)
  var lngRangeOver = nelng;  // 経度の上限(上の線)
  var lngRangeUnder = swlng;  // 経度の下限(下の線)
  
  var latBlock = (latRangeOver - latRangeUnder)/10;  // 1ブロックの緯度の大きさ
  var lngBlock = (lngRangeOver - lngRangeUnder)/24;  // 1ブロックの経度の大きさ(正方形にするためには必要ないと思う)
  
  var latBlockOver;  // ブロックの緯度の上限
  var latBlockUnder;  // ブロックの緯度の下限
  var lngBlockOver;  // ブロックの経度の上限
  var lngBlockUnder;  // ブロックの経度の下限
  
  var cnt;
  
  for(var i = 0; i < 24; i++) {
    // ブロックの経度の上下限の代入
    lngBlockOver = latRangeUnder + (i * latBlock);
  	lngBlockUnder = latRangeUnder + ((i+1) * latBlock);
  	
  	for(var j = 0; j < 10; j++) {
  	  // ブロックの緯度の上下限の代入
  	  latBlockOver = latRangeUnder + (j * latBlock);
  	  latBlockUnder = latRangeUnder + ((j+1) * latBlock);
  	  
  	  for(var k = 0; k < heatMarkersの最大数; k++){
  	    if(heatMarkers[k].position.lat > latBlockUnder && heatMarkers[k].position.lat >= latBlockOver
  	    && heatMarkers[k].position.lng > lngBlockUnder && heatMarkers[k].position.lng >= lngBlockOver){
  	      cnt++;
  	    }
  	  }
  	  // 個数によって色付け
  	}
  }
};
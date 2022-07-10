
// https://makezine.jp/event/mft2022/
// 東京ビッグサイト　西4ホール


function HitoMapMFT(){

    function centorLatLngObject( startLat_, startLng_, endLat_, endLng_ ){
        var object = {
            Lat: ( endLat_ - startLat_) / 2,
            Lng: ( endLng_ - startLng_) / 2 
        };
        return object
    }

    function createMeshObject( Lat_, Lng_,  weight_, text_ ){
        object = {
            location: new google.maps.LatLng(Lat_, Lng_ ),
            weight: weight_
        };
        creatSpeechBubble(Lat_, Lng_, text_ );
        return object; 
    }
    function createHeatMap(heatMapData){
        // 個数によって色付け
        // https://developers.google.com/maps/documentation/javascript/heatmaplayer
        return new google.maps.visualization.HeatmapLayer({
            data: heatMapData,
            map: map,
            radius:radius,
            opacity:0.5,
            gradient: [ 'rgba(  0, 255, 255, 0)',
                        'rgba( 80, 255, 240, 1)',
                        'rgba(255, 229,  80, 1)',
                        'rgba(255,  80, 226, 1)'],
        });
    }


    function creatSpeechBubble( lat_, lng_, text_ ){
        var center = { lat: lat_,lng: lng_ };
        //-------------------------------------
        //マーカー作成
        //-------------------------------------
        const markerOption = {
            position: center, // マーカーを立てる位置を指定
            map: map,         // マーカーを立てる地図を指定
            icon: { url: './image/Twitter-Logo.mini.png'},
            animation:  google.maps.Animation.DROP,
        };
        const marker = new google.maps.Marker(markerOption);

        var contentText = text_;
        contentText = contentText.replace("||", "<br>");
        contentText = contentText.replace("&&", " + ");

        var jump_url = "https://twitter.com/search?q=" + encodeURIComponent(text_) + "&src=typed_query&f=top";
        const infoWindow = new google.maps.InfoWindow({
            position: center,
            content: `<div class='tweetBubble'><a href=` + jump_url + ` target='_blank'>` + contentText + `</a>` `</div>`,
            pixelOffset: new google.maps.Size( left = 10, top = -15 )
        });

        //マーカーをクリックしたら情報ウィンドウを開く
        marker.addListener('mouseover', () => {
            infoWindow.open(map, marker);
        });
        marker.addListener('mouseout', () => {
            infoWindow.close(map, marker);
        });
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        return infoWindow;
    }
    
    function getCurentPostionData(){
        var latlngBounds = map.getBounds();
        var swLatlng = latlngBounds.getSouthWest();
        var neLatlng = latlngBounds.getNorthEast();
    
        return positionRangeInfo = {
            latUnder: swLatlng.lat() ,
            latUpper: neLatlng.lat() ,
            lngUnder: swLatlng.lng() ,
            lngUpper: neLatlng.lng() 
        };
    }

    // this.heatMapObject_;
    this.movePlace = function(){
        var latlngMFT = new function (){
            this.lat_ = 35.62856267091947;
            this.lng_ = 139.79523379269762;
        }
        map.panTo(new google.maps.LatLng(latlngMFT.lat_, latlngMFT.lng_ ));
        map.setZoom(20);
    };

    this.clearMap = function(){
        this.heatMapData_ = [];
        this.heatMapObject_.setMap(null);
    }

    this.serachVicinity = function(){
        if( null == this.TweetListHitoMapTable ){
            this.TweetListHitoMapTable = new TweetListHitoMapTableAccessor();
        }
        this.TweetListHitoMapTable.QueryTweetList(
            getCurentPostionData()
        );
    }
    
    this.initialize = function(){   
        this.heatMapData_ = [];
        this.heatMapData_.push(createMeshObject( lat = 35.62862657730198, lng = 139.79511748377507, weight = 1, "#MFT2022 AND #SC OR #MFT2022 AND #その発想なかったわ" ));
        this.heatMapData_.push(createMeshObject( lat = 35.62839667225012, lng = 139.7953466912765 , weight = 4, "#MFT2022 AND #Apple" ));
        this.heatMapData_.push(createMeshObject( lat = 35.62860279405142, lng = 139.79538936288583, weight = 2, "#MFT2022 AND #Microsof OR #MFT2022 AND #メカ" ));
        this.heatMapData_.push(createMeshObject( lat = 35.62829667225012, lng = 139.79534669123365, weight = 4, "#MFT2022 AND #いらすとや" ));
        this.heatMapObject_ = createHeatMap(this.heatMapData_);
    }
};



function post_to_http_request( url_, data_ ){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var ele = JSON.stringify({Element: data_ }, null, ' ');
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: ele,
        redirect: 'follow'
    };

    fetch( url_, requestOptions)
        .then(response => response.json())
            .then(result => {
                if(result.statusCode==200){
                    const data = JSON.parse(result.body);
                    const item = data['Items'];
                    var itemArray = ParsePartiQLtoArray(item);
                    resolve(itemArray);
                }else{
                    console.log(result.body);
                }
            })
            .catch(error => console.log('error', error));
};


class TweetListHitoMapTableAccessor{

    // SQL送信の共通処理
    QueryTweetList( positionRangeInfo ){
        var function_name = "QueryTweetList";
        var HitoMapURL    = "https://z06c2y3yq8.execute-api.ap-northeast-1.amazonaws.com/dev";
        var sql = [
              `SELECT id,latlng_vicinity,lat,lng,posts_num,search_word `
            , `FROM "TweetList.HitoMap"`
            , `WHERE ( lat BETWEEN ` + positionRangeInfo.latUnder + ` AND ` + positionRangeInfo.latUpper + ` )`
            , `AND ( lng BETWEEN ` + positionRangeInfo.lngUnder + ` AND ` + positionRangeInfo.lngUpper + ` )`
        ].join(" ");

        return new Promise(function(resolve, reject) {
            console.log(`SQL = ${sql}`);
            var data = { function: function_name, sql: sql };
            post_to_http_request( HitoMapURL, data );
        });
    };
}
  
  

var HitoMapMFTObject = new HitoMapMFT();

function movePlaceOfMFT(){
    HitoMapMFTObject.movePlace();

    HitoMapMFTObject.serachVicinity();
    HitoMapMFTObject.initialize();
}
function clearMFT(){
    HitoMapMFTObject.clearMap();
}

function serachserachVicinity(){
    HitoMapMFTObject.serachVicinity();
}

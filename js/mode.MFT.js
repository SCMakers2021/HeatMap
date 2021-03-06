
// https://makezine.jp/event/mft2022/
// 東京ビッグサイト　西4ホール

var  openSpeechBubbles_ = [];


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
            content: `<div class='tweetBubble'><a class='tweetJump' href=` + jump_url + ` target='_blank'>` + contentText + `</a></div>`,
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
            let index = openSpeechBubbles_.indexOf(infoWindow);
            if( -1 == index){
                infoWindow.open(map, marker);
                openSpeechBubbles_.push(infoWindow);
            }else{
                infoWindow.close(map, marker);
                openSpeechBubbles_.splice(index,1);
            }
            // $('.tweetJump').blur();
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

    this.interval_timer;
    this.clearMap = function(){
        this.heatMapData_ = [];
        this.heatMapObject_ = createHeatMap(this.heatMapData_);
        clearInterval(this.interval_timer);
    }

    this.serachVicinity = function(){
        this.TweetListHitoMapTable.QueryTweetList(getCurentPostionData());
    }
    this.searchInitialLocation = function(){
        if( null == this.TweetListHitoMapTable ){
            this.TweetListHitoMapTable = new TweetListHitoMapTableAccessor();
        }
        var latlngRangeMFT = {
            latUnder : 35.62856267091947 - 1.0,
            latUpper : 35.62856267091947 + 1.0,
            lngUnder : 139.79523379269762 - 1.0,
            lngUpper : 139.79523379269762 + 1.0
        };

        this.TweetListHitoMapTable.QueryTweetList(latlngRangeMFT);
    }
    
    this.initialize = function(){   
        this.heatMapData_ = [];
        const interval_time_msec = 1000*60*15;
        this.interval_timer = setInterval(function(){
            this.searchVicinity();
        }, interval_time_msec);
    }

    this.queryResponseCallback = function( statusCode, body ){
        if(statusCode==200){
            console.log(body);
            const data = JSON.parse(body);
            data['Items'].forEach( (element, index) => {
                //console.log("lat:" + element.lat.N);
                //console.log("lng:" + element.lng.N);
                //console.log("posts_num:" + element.posts_num.N);
                //console.log("search_word:" + element.search_word.S);
                this.heatMapData_.push(createMeshObject( 
                    parseFloat(element.lat.N), 
                    parseFloat(element.lng.N), 
                    parseInt(element.posts_num.N), 
                    element.search_word.S 
                ));
            });
            this.heatMapObject_ = createHeatMap(this.heatMapData_);
        }else{
            console.log(body);
        }
    }
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
    HitoMapMFTObject.initialize();
    HitoMapMFTObject.searchInitialLocation();
}
function clearMFT(){
    HitoMapMFTObject.clearMap();
}

function searchVicinity(){
    HitoMapMFTObject.serachVicinity();
}


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
                HitoMapMFTObject.queryResponseCallback(result.statusCode, result.body);
            })
            .catch(error => console.log('error', error));
};

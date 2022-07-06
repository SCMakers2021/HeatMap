
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
            // https://developers.google.com/maps/documentation/javascript/heatmaplayer
    }

    function creatSpeechBubble( lat_, lng_, text_ ){
        var center = { lat: lat_,lng: lng_ };
        //マーカーオプション設定
        const markerOption = {
            position: center, // マーカーを立てる位置を指定
            map: map, // マーカーを立てる地図を指定
            icon: {
                url: './image/Twitter-Logo.mini.png' // お好みの画像までのパスを指定
            },
            animation:  google.maps.Animation.DROP,
        };
        //マーカー作成
        const marker = new google.maps.Marker(markerOption);

        var contentText = text_;
        contentText = contentText.replace("||", "<br>");
        contentText = contentText.replace("&&", " + ");

        const infoWindow = new google.maps.InfoWindow({
            position: center,
            content: `<div class='tweetBubble'>
                        ` + contentText + `
                      </div>`,
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
            var jump_url = "https://twitter.com/search?q=" + encodeURIComponent(text_) + "&src=typed_query&f=top";
            window.open(jump_url);
        });
                  
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

    this.initialize = function(){   
        this.heatMapData_ = [];
        this.heatMapData_.push(createMeshObject( lat = 35.62862657730198, lng = 139.79511748377507, weight = 1, "#MFT2022 AND #SC OR #MFT2022 AND #その発想なかったわ" ));
        this.heatMapData_.push(createMeshObject( lat = 35.62839667225012, lng = 139.7953466912765 , weight = 4, "#MFT2022 AND #Apple" ));
        this.heatMapData_.push(createMeshObject( lat = 35.62860279405142, lng = 139.79538936288583, weight = 2, "#MFT2022 AND #Microsof OR #MFT2022 AND #メカ" ));
        this.heatMapData_.push(createMeshObject( lat = 35.62829667225012, lng = 139.79534669123365, weight = 4, "#MFT2022 AND #いらすとや" ));
        this.heatMapObject_ = createHeatMap(this.heatMapData_);
    }
};

var HitoMapMFTObject = new HitoMapMFT();

function movePlaceOfMFT(){
    HitoMapMFTObject.movePlace();
    HitoMapMFTObject.initialize();
}
function clearMFT(){
    HitoMapMFTObject.clearMap();
}

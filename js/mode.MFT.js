
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
        function createMeshObject( Lat_, Lng_,  weight_ ){
        object = {
            location: new google.maps.LatLng(Lat_, Lng_ ),
            weight: weight_
        };
        return object; 
    }
    function createHeatMap(heatMapData){
        
      // 個数によって色付け
        return new google.maps.visualization.HeatmapLayer({
            data: heatMapData,
            map: map,
            radius:radius,
            gradient: ['rgb(80, 98, 255)','rgb(80, 255, 240)','rgb(255, 229, 80)', 'rgb(255, 80, 226)'],
            });
            // https://developers.google.com/maps/documentation/javascript/heatmaplayer
    }

    
    this.heatMapObject_;
    this.movePlace = function(){
        var lat = 35.62856267091947;
        var lng = 139.79523379269762;
        map.panTo(new google.maps.LatLng(lat,lng));
        map.setZoom(20);
    };

    this.clearMap = function(){
        this.heatMapData_ = [];
        this.heatMapObject_ = createHeatMap(this.heatMapData_);
        this.heatMapObject_.setMap(null);
    }

    this.initialize = function(){   
        this.heatMapData_ = [];
        this.heatMapData_.push(createMeshObject(35.62862657730198, 139.79511748377507,1));
        this.heatMapData_.push(createMeshObject(35.62839667225012, 139.7953466912765,4));
        this.heatMapData_.push(createMeshObject(35.62860279405142, 139.79538936288583,2));
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

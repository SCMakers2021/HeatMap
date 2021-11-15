/* map�֌W�̃I�u�W�F�N�g���O���[�o���Œ�` */
var map = {};
var marker,infoWindow,markers=[];

function getMassage(){
  const textbox = document.getElementById("input-message");
  return textbox.value;
};


$(function() {
  /* �ΏۂƂȂ�^�C�g�����������}�[�J�[�̏ڍׂ��J�� */
  $(".location a").click(function() {
    for(var i = 0; i < markers.length; i++) {
      if(marker[i].title == $(this).attr("data-title")) {
        //�}�[�J�[�ƃ^�C�g������v������ڍׂ�\��
        infoWindow[i].open(map, marker[i]);
      } else {
        //�}�[�J�[�ƃ^�C�g������v���Ȃ���Ώڍׂ����
        infoWindow[i].close();
      }
    }
    return false;
  });
});

// �N���b�N�C�x���g���쐬
// �N���b�N������}�[�J�[��ݒu
function initialize() {
  // �\������ꏊ��id���擾
  var target = document.getElementById("map_canvas") 
  // �o�x�Flat�C�ܓx�Flng��ݒ�
  var centralLatLng = {lat: 34.757555, lng: 135.497010};
  var options = {
    zoom: 10, // �Y�[��1�͈�ԏ�����
    center: centralLatLng, //Map�̒���:��̍��W
    mapTypeControl: false, //�}�b�v�^�C�v �R���g���[��
    fullscreenControl: false, //�S��ʕ\���R���g���[��
    streetViewControl: false, //�X�g���[�g�r���[ �R���g���[��
    zoomControl: true //�Y�[�� �R���g���[��
  };
  // Map���쐬
  map = new google.maps.Map(target, options);

  /* �}�[�J�[�̃A�C�R���̐ݒ� */
  var markerImage = {
    url: "image/maker.Red.png", //�摜��URL
    size: new google.maps.Size(32, 32), //�T�C�Y
    origin: new google.maps.Point(0, 0), //�A�C�R���̊�ʒu
    anchor: new google.maps.Point(16, 32), //�A�C�R���̃A���J�[�|�C���g
    scaledSize: new google.maps.Size(32, 32) //�A�C�R���̃T�C�Y
  };

  // Map���N���b�N���鎞�̓���
  map.addListener("click",function(e){
    // �R���\�[���Ōo�x��\��
    console.log("lat: " + e.latLng.lat());
    // �R���\�[���ňܓx��\��
    console.log("lng: " + e.latLng.lng());
    // �R���\�[����{�o�x,�ܓx}��\��
    console.log("(lat,lng): " + e.latLng.toString());
    // this.setCenter(e.latLng); // �N���b�N����ꏊ��Map�̒��S�ɂ���(��ʂ̈ړ����x������)
    this.panTo(e.latLng); //�N���b�N����ꏊ��Map�̒��S�ɂ���(��ʂ̈ړ����x���������)
    
    if(marker != null){
      marker.setMap(null);
    }
    
    // �N���b�N����ꏊ���}�[�J�[�𗧂Ă�
    marker = new google.maps.Marker({
      position: e.latLng,
      map: map,
      icon: markerImage,
      title: e.latLng.toString(),
      animation: google.maps.Animation.DROP // �}�[�J�[�𗧂Ƃ��̃A�j���[�V����
    });
    // ��ŗ��Ă��}�[�J�[��������x�N���b�N����ƃ}�[�J�[���폜
    //marker.addListener("click",function(){
    //  this.setMap(null);
    //});
    
    /* �}�[�J�[�̏���ݒ� */
//    markers = [
//      {
//        position: e.latLng,
//        title: '���e',
//        summary: 'getMassage()',
//        figure: 'images/figure01.jpg'
//      }
//    ];
    
    // �ꏊ�̏Z���̏���
    geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({
      latLng: e.latLng
    }, function(results, status) {
    
        var address = results[0].formatted_address.replace(/^���{, /, '');
    
    /* �ꏊ�̏ڍׂ̏��� */
      infoWindow = new google.maps.InfoWindow({
//      content: '<section style="margin-top:5px;"><figure style="float: left;"><img src="' + markers[0].figure + '" width="64px"></figure><div style="margin-left: 74px;"><h2 style="margin-bottom: 5px;font-size: 1.17em;">' + markers[0].title + '</h2><p style="font-size: 0.84em;">' + markers[0].summary + '</p></div><div><input type="button" value="test2" onclick="visualize()" onkeypress="visualize()" /></div><input type="text" id="activationKey" placeholder="Activation Key"></section>'
        content:   "<div id='speechBubble' value='init'>" 
                 + address
                 + "  <div class='AmariForm' id='AmariFormMap'>"
                 + "  <div class='currentPointArea'></div>"
                 + "    <input class='okButton' type='button' value='���e' onclick='onEntryBtnClicked()'>"
                 + "  </div>"
                 + "</div>",
//        position: new google.maps.LatLng(,),  //�����o���̈ʒu
//        pixelOffset: new google.maps.Size( -225, 0 ),  // �N���b�N�ӏ��ɑ΂��鐁���o���̐�[�̈ʒu
      });
      infoWindow.open(map, marker);
    });
    /* �}�[�J�[���N���b�N������ꏊ�̏ڍׂ�\�� */
    google.maps.event.addListener(marker, 'click', function(e) {
      for(var i = 0; i < markers.length; i++) {
        if(marker.position.G == e.latLng.G && marker.position.K == e.latLng.K) {
          //�N���b�N�����}�[�J�[��������ڍׂ�\��
          infoWindow.open(map, marker);
        } else {
          //�N���b�N�����}�[�J�[�łȂ���Ώڍׂ����
          infoWindow.close();
        }
      }
    });
    
  });
};

function visualize(){
  heatMapData = [
    //{location: new google.maps.LatLng(marker.position.lat, marker.position.lng), weight: 0.5},
    {location: marker.position, weight: 4},
    {location: new google.maps.LatLng(35.43820870035895,139.27825203125), weight: 2},
  ];
  heatmap = new google.maps.visualization.HeatmapLayer({
   data: heatMapData,
   map: map,
   radius:50,	// �e�f�[�^ �|�C���g�̉e���̔��a (�s�N�Z���P��)�B
  });
};
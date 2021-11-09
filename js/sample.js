/* map�֌W�̃I�u�W�F�N�g���O���[�o���Œ�` */
var map = {};
var heatmap;
var marker,infoWindow,markers=[];
const HeatMapURL = "https://z06c2y3yq8.execute-api.ap-northeast-1.amazonaws.com/dev";

function getMassage(){
  const textbox = document.getElementById("input-message");
  return textbox.value;
};

function RegisterDB(){
  if(markers != null){
	// �v���_�E������J�e�S����I��
	let category = document.getElementById('category');

    var data = {
    	function: "InsertData",
    	category: category.selectedIndex,
        position: markers[0].position,
        summary: markers[0].summary,
    };
    
    
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var ele = JSON.stringify({Element: data}, null, ' ');
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: ele,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    apiFetch(HeatMapURL, requestOptions)
    .then(response => response.text())
    .then(result => alert(JSON.parse(result).body))
    .catch(error => console.log('error', error));
  }
};

function ReadDB(){
  if(markers != null){
	// �v���_�E������J�e�S����I��
	let category = document.getElementById('category');

//	var latUnder = markers[0].position.lat() - 1;
//	var latUpper = markers[0].position.lat() + 1;
//	var lngUnder = markers[0].position.lng() - 1;
//	var lngUpper = markers[0].position.lng() + 1;
    var posiData = {
    	latUnder: markers[0].position.lat() - 1,
    	latUpper: markers[0].position.lat() + 1,
        lngUnder: markers[0].position.lng() - 1,
        lngUpper: markers[0].position.lng() + 1
    };

    var data = {
    	function: "ReadData",
    	category: category.selectedIndex,
        position: posiData
    };
    
    
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var ele = JSON.stringify({Element: data}, null, ' ');
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: ele,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    apiFetch(HeatMapURL, requestOptions)
    .then(response => response.text())
    .then(result => alert(JSON.parse(result).body))
    .catch(error => console.log('error', error));
  }
};

//function ReadDB(){
//  if(markers != null){
//
//    var data = {
//        position: markers[0].position,
//        summary: markers[0].summary,
//    };
//    
//    
//    // instantiate a headers object
//    var myHeaders = new Headers();
//    // add content type header to object
//    myHeaders.append("Content-Type", "application/json");
//  // using built in JSON utility package turn object to string and store in a variable
//  var ele = JSON.stringify({Element: data}, null, ' ');
//    // create a JSON object with parameters for API call and store in a variable
//    var requestOptions = {
//        method: 'GET',
//        headers: myHeaders,
//        body: ele,
//        redirect: 'follow'
//    };
//
//	var latUnder = markers[0].position.lat() - 1;
//	var latUpper = markers[0].position.lat() + 1;
//	var lngUnder = markers[0].position.lng() - 1;
//	var lngUpper = markers[0].position.lng() + 1;
//    const categoryid   = encodeURIComponent("1");
//    // URL?category=1&latUnder=35.5&latUpper=36.5&lngUnder=135.1&lngUpper=136.1
//    var request = HeatMapURL + '?category=' + categoryid
//     + '&latUnder=' + latUnder + '&latUpper=' + latUpper + '&lngUnder=' + lngUnder + '&lngUpper=' + lngUpper;
//	fetch(request)
//	  .then((res)=>{
//	  	console.log(res);
//	    return( res.json() );
//	  })
//	  .then((json)=>{
//	    // �����ɉ��炩�̏���
//	    console.log('json�̃��[�g');
//	    console.log(json);
//	  });
//    
//  }
//};

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
  var latlng = {lat: 35.383575, lng: 139.344170};
  var options = {
    zoom: 10, // �Y�[��1�͈�ԏ�����
    center: latlng, //Map�̒���:��̍��W
    mapTypeControl: false, //�}�b�v�^�C�v �R���g���[��
    fullscreenControl: false, //�S��ʕ\���R���g���[��
    streetViewControl: false, //�X�g���[�g�r���[ �R���g���[��
    zoomControl: true //�Y�[�� �R���g���[��
  };
  // Map���쐬
  map = new google.maps.Map(target, options);

  /* �}�[�J�[�̃A�C�R���̐ݒ� */
  var image = {
    url: "images/mark.png", //�摜��URL
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
      icon: image,
      title: e.latLng.toString(),
      animation: google.maps.Animation.DROP // �}�[�J�[�𗧂Ƃ��̃A�j���[�V����
    });
    // ��ŗ��Ă��}�[�J�[��������x�N���b�N����ƃ}�[�J�[���폜
    //marker.addListener("click",function(){
    //  this.setMap(null);
    //});
    
    /* �}�[�J�[�̏���ݒ� */
    markers = [
      {
        position: e.latLng,
        title: '���e',
        summary: getMassage(),
        figure: 'images/figure01.jpg'
      }
    ];
    
    /* �ꏊ�̏ڍׂ̏��� */
    infoWindow = new google.maps.InfoWindow({
      content: '<section style="margin-top:5px;"><figure style="float: left;"><img src="' + markers[0].figure + '" width="64px"></figure><div style="margin-left: 74px;"><h2 style="margin-bottom: 5px;font-size: 1.17em;">' + markers[0].title + '</h2><p style="font-size: 0.84em;">' + markers[0].summary + '</p></div><div><input type="button" value="test2" onclick="visualize()" onkeypress="visualize()" /></div><input type="text" id="activationKey" placeholder="Activation Key"></section>'
    });
    infoWindow.open(map, marker);
    
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
  
  const categoryList = 
          ["���i", "�V�Ղ�", "���ł�"];

   const selectCategoryName = document.getElementById('category');
   //menuList.disabled = false; //�I���\�ȏ�Ԃɂ���
   //�I�����ꂽ�W�������̃��j���[�ꗗ�ɑ΂��ď���������
   categoryList.forEach((category, index) => {
     const option = document.createElement('option'); //option�v�f��V�������
     option.value = index; //option�v�f�̒l�ɁA���j���[�����ʂł���ԍ����w�肷��
     option.innerHTML = category; //���[�U�[�����̕\���Ƃ��ă��j���[�����w�肷��
     selectCategoryName.appendChild(option); //�Z���N�g�{�b�N�X��option�v�f��ǉ�����
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
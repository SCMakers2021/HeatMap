/* map�֌W�̃I�u�W�F�N�g���O���[�o���Œ�` */
var heatmap;

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
    fetch(HeatMapURL, requestOptions)
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
    fetch(HeatMapURL, requestOptions)
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

  
//  const categoryList = 
//          ["���i", "�V�Ղ�", "���ł�"];
//
//   const selectCategoryName = document.getElementById('category');
//   //menuList.disabled = false; //�I���\�ȏ�Ԃɂ���
//   //�I�����ꂽ�W�������̃��j���[�ꗗ�ɑ΂��ď���������
//   categoryList.forEach((category, index) => {
//     const option = document.createElement('option'); //option�v�f��V�������
//     option.value = index; //option�v�f�̒l�ɁA���j���[�����ʂł���ԍ����w�肷��
//     option.innerHTML = category; //���[�U�[�����̕\���Ƃ��ă��j���[�����w�肷��
//     selectCategoryName.appendChild(option); //�Z���N�g�{�b�N�X��option�v�f��ǉ�����
//   });
};

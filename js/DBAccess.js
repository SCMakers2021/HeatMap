const HeatMapURL = "https://z06c2y3yq8.execute-api.ap-northeast-1.amazonaws.com/dev";

// 期限を取得
function GetDeadTime(){
  var date = $('#deadTime').val();
  return date;
}

function GetPicJson(){
  let file = document.querySelector('#AmariPic').files[0];

  var picJson = {
      ext:"png",
      contentType:"image/png",
      base64:"iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAD3SURBVFhHzZZLDoQwDENb7n9nIKhFQ2hSOy3qvA2zILbzEZq8nySCnHP51YaUS1CAnqkFEsYNEDXWeEG28nwxy1zwtJoTiO45UvcK4IlYxhpG47ECq1CKUHPBe1d73AF642NBQ5hHWGE61yC1V4DZ3SNUT3cCI91XehrdFXzNtmL8FfFeP4HyXIYbYMZ6ehr/v4KRKSC10AQiIdAaeAVMCOrd80u1sx1aX7eITijALOgAUoDA6F03gAij5gKjBx0hY15Ba+4AVkHEvIJoPiYwYoaiPUJ/y6O0GmzewBeTsDTNI5wZwtNqrkATXQnSBBTgl14YTi6lA6SWoPiLH8skAAAAAElFTkSuQmCC"
  }

  return picJson;
}

function RegisterDB(){
    if((amariMarker != null) && (AmariPicJson != null)){
      // プルダウンからカテゴリを選択
      let category = document.getElementById('category');
      var commnet = $('#commnet').val();
      var deadTime = GetDeadTime();
      var userID = token.Sub;

      var data = {
          function: "AddStoreInfo",
          userID: userID,
          position: amariMarker.position,
          categoryID: category.selectedIndex,
          comment: commnet,
          deadTime: deadTime,
          pic:AmariPicJson
      };
      console.log(data);
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
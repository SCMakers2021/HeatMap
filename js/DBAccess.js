const HeatMapURL = "https://z06c2y3yq8.execute-api.ap-northeast-1.amazonaws.com/dev";

// 期限を取得
function GetDeadTime(){
  var date = $('#deadTime').val();
  return date;
}

function RegisterDB(){
    if((amariMarker != null) && (AmariPicJson != null)){
      // プルダウンからカテゴリを選択
      let category = document.getElementById('category');
      var comment = $('#comment').val();
      var deadTime = GetDeadTime();
      var userID = token.Sub;

      var data = {
          function: "AddStoreInfo",
          userID: userID,
          position: amariMarker.position,
          categoryID: category.selectedIndex,
          comment: comment,
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
      .then(result => 
        //alert(JSON.parse(result).body)
        alert("投稿しました")
        )
      .catch(error => console.log('error', error));
    }
  };

  function GetSagasuInfo(key){
    if(markers != null){
      // プルダウンからカテゴリを選択
      let category = document.getElementById('category');
      var latlngBounds = map.getBounds();
  
      var swLatlng = latlngBounds.getSouthWest();
      var swlat = swLatlng.lat();
      var swlng = swLatlng.lng();
    
      var neLatlng = latlngBounds.getNorthEast();
      var nelat = neLatlng.lat();
      var nelng = neLatlng.lng();
    
      var posiData = {
        latUnder: nelat ,
        latUpper: swlat ,
        lngUnder: nelng ,
        lngUpper: swlng 
      };
      //
      var sql = "SELECT categoryID,lat,lng,StoreComment FROM HeatMapStoreInfo where categoryID in (0,3)";
      console.log(`SQL = ${sql}`);
      
      var data = {
        function: "ReadStoreInfo",
        //category: category.selectedIndex,
        category: key,
        position: posiData,
        sql: sql
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
      //JSONデータを操作する
      getJSONdata(HeatMapURL,requestOptions)
  
    }
  };
  
   async function getJSONdata(HeatMapURL,requestOptions){
  
    const res = await fetch(HeatMapURL, requestOptions);
      const resjson = await res.json();
  
    const data = JSON.parse(resjson.body);
    const item = data['Items'];
    // Object.keys(item).forEach(function (key) {
    //       console.log([key] + ": " + item[key].StoreComment);
    //   console.log([key] + ": " + item[key].lat);
    //   });
  
      // console.log('DynamoDBdata：',item)
  
    setSagasuMarker(item);
    // console.log(resjson.body)
  }
  


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
        // alert("投稿しました")
        AddStoreInfoAfter(category.selectedIndex,amariMarker.position)
        )
      .catch(error => console.log('error', error));
    }
  };

  // 検索+登録後のウィンドウを表示
  function AddStoreInfoAfter(key,pos){
    // console.log(pos);
    GetSagasuInfo(key)
    .then(resolve => {
      // console.log(resolve);
        // streetビューの表示(吹き出しが出た後じゃないとIDが取れないので)
        openSagasuMarkerWindow(pos.lat(),pos.lng());
        // アマリのマーカーと吹き出しの非表示
        CancelAmariMode();
      });
  }

  // PartiQLの戻り値は「"lat": {"N": "35.689090029122006"},」の形式で帰ってくるため、"N"の箇所を取り除いて配列を生成する。
  function ParsePartiQLtoArray(partiQL){
    var RetArray = [];
    partiQL.forEach((element, index) => {
      let a = new Object();
      for (const [key, value] of Object.entries(element)) {
        for (const [key1, value1] of Object.entries(value)) {
          // console.log(`${key1}: ${value1}`);
          a[key] = value1;
        }
      }
      RetArray.push(a);
    });
    return RetArray;
  }

  function MakeSQL1CategorySelect(categoryID,posiData){
    var sql = `SELECT UserID,categoryID,lat,lng,StoreComment,deadTime,imagePath `
            + `FROM HeatMapStoreInfo `
            + `where categoryID = ${categoryID} `
            + ` AND lat BETWEEN ${posiData.latUnder} AND ${posiData.latUpper}`
            + ` AND lng BETWEEN ${posiData.lngUnder} AND ${posiData.lngUpper}`;
    return sql;
  }

  // 検索
  function GetSagasuInfo(key){
    return new Promise(function(resolve,reject) {
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
          latUnder: swlat ,
          latUpper: nelat ,
          lngUnder: swlng ,
          lngUpper: nelng 
        };
        //
        var sql = MakeSQL1CategorySelect(key,posiData);
        console.log(`SQL = ${sql}`);
        
        var data = {
          // function: "ReadStoreInfo",
          function: "ReadStoreInfoForSQL",
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
        // getJSONdata(HeatMapURL,requestOptions)
        fetch(HeatMapURL, requestOptions)
        .then(response => response.json())
        .then(result => 
          {
            if(result.statusCode==200){
              const data = JSON.parse(result.body);
              const item = data['Items'];
              // console.log("item：");
              // console.log(item);
              var itemArray = ParsePartiQLtoArray(item);
              // console.log("itemArray：");
              // console.log(itemArray);
              MakeSagasuInfList(itemArray);

              // 検索結果をもとにユーザ情報も取得する
              GetSagasuUserInfo()
              .then(result =>
                {
                  // 出店情報とユーザ情報がそろったのでマーカーを設置する
                  setSagasuMarker(itemArray);
                  resolve('Success!GetSagasuInfo()');
                })
            }else{
                console.log(result.body);
            }
          })
        .catch(error => console.log('error', error));
      }
      
    });
  };
  
// 検索結果をもとにユーザ情報を取得する
function GetSagasuUserInfo(){
  return new Promise(function(resolve,reject) {
    var sql = MakeSQLSagasuUserList();
    console.log(`SQL = ${sql}`);
    
    // SQLを投げる場合はReadStoreInfoForSQLでOK
    var data = {
      function: "ReadStoreInfoForSQL",
      category: 0,
      position: 0,
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
    fetch(HeatMapURL, requestOptions)
    .then(response => response.json())
    .then(result => 
      {
        if(result.statusCode==200){
          const data = JSON.parse(result.body);
          const item = data['Items'];
          var itemArray = ParsePartiQLtoArray(item);
          // console.log("itemArrayUser：");
          // console.log(itemArray);
          resolve('Success!GetSagasuUserInfo()');
          //ユーザ情報を取り出して配列に入れる
          AddUserInfToSagasuInfList(itemArray);
        }else{
            console.log(result.body);
        }
      })
    .catch(error => console.log('error', error));
    
  });
};
  


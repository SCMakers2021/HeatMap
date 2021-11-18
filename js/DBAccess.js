const HeatMapURL = "https://z06c2y3yq8.execute-api.ap-northeast-1.amazonaws.com/dev";

function RegisterDB(){
    if(markers != null){
      // プルダウンからカテゴリを選択
      let category = document.getElementById('category');
      var commnet = $('#commnet').val();
    
      var data = {
          function: "AddStoreInfo",
          userID: "0123456789",
          position: marker.position,
          categoryID: category.selectedIndex,
          comment: commnet,
          imagePath: "images/mark.png",
          deadTime: 100
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
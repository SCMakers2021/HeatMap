// tweetボタンを生成
function CreateTweetButton(){
    var commnet = $('#commnet').val();
    var tweetButton = document.getElementById("twitter-widget-0");
    // ボタンは1個だけ。
    if (tweetButton != null) {
      // すでにボタンがあれば作成せず、メッセージだけ書き換える。
      var url = tweetButton.src;
      var textPos = url.match(/text=/);
      var timePos = url.match(/time=/);
      var urlText = url.slice(0, textPos.index+5) + commnet + url.slice(timePos.index-1,url.length);
      console.log(url);
      console.log(urlText);
  
      tweetButton.src = urlText;
      // ボタンを更新
      twttr.widgets.load(
        // document.getElementById("tweetButton")
        );
    }else{
      twttr.widgets.createShareButton(
        "https://master.d3s8lj7u41imf0.amplifyapp.com/",
        document.getElementById('tweetButton'),
        {
          text: commnet,
          hashtags: "HitoMap"
        }
      ).then( function( el ) {
        console.log('Tweet button added.');
      });
    }
}
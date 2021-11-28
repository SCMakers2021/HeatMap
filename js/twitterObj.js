// tweetボタンを生成
function CreateTweetButton(){
    var comment = $('#comment').val();
    if(comment == ""){comment="HitoMapに投稿しました。";}

    var tweetButton = document.getElementById("twitter-widget-0");
    const TweetArea = document.getElementById("TweetButtonArea");

    // ボタンは1個だけ。
    if (tweetButton != null) {
      // // すでにボタンがあれば削除する。
      if (TweetArea.hasChildNodes()) {
        TweetArea.removeChild(TweetArea.firstElementChild);
      }
    }
    
    // ボタンが無ければボタンの追加
    if (TweetArea.firstElementChild==null) {
      const tweetButton = document.createElement("a");
      tweetButton.setAttribute("id", "tweetButton");
      TweetArea.appendChild(tweetButton);
    
      // tweetボタンを生成。
      twttr.widgets.createShareButton(
        "https://master.d3s8lj7u41imf0.amplifyapp.com/",
        document.getElementById('tweetButton'),
        {
          text: comment,
          hashtags: "HitoMap"
        }
      ).then( function( el ) {
        console.log('Tweet button added.');
        // 生成後、更新しておく。(これをいれないとtextが更新されなかったため。)
        twttr.widgets.load(
          document.getElementById("tweetButton")
        );
      });
    }
}
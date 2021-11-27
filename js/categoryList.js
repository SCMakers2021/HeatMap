 const categoryList = [
     ["お弁当","image\category\日の丸弁当アイコン1.png"],
     ["ケーキ","image\category\ケーキのアイコン3.png"],
     ["寿司","image\category\寿司アイコン.png"],
     ["たまねぎ","image\category\たまねぎイラスト1.png"],
     ["トマト","image\category\トマトのアイコン2.png"],
     ["ブロッコリー","image\category\ブロッコリーアイコン1.png"]
 ];
         
function MakeCategoryList(){
    const selectCategoryName = document.getElementById('category');
    
    //選択されたジャンルのメニュー一覧に対して処理をする
    categoryList.forEach((category, index) => {
      const option = document.createElement('option'); //option要素を新しく作る
      option.value = index; //option要素の値に、メニューを識別できる番号を指定する
      option.innerHTML = category[0]; //ユーザー向けの表示としてメニュー名を指定する
      selectCategoryName.appendChild(option); //セレクトボックスにoption要素を追加する
    });
}

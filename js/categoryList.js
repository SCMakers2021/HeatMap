 const categoryList = [
     ["お弁当","image/category/日の丸弁当アイコン1.png"],
     ["ケーキ","image/category/ケーキのアイコン3.png"],
     ["寿司","image/category/寿司アイコン.png"],
     ["ハンバーガー","image/category/ハンバーガーのアイコンその2.png"]
 ];
      
 function getCategoryName(categoryID){
    return categoryList[categoryID][0];
}
function getCategoryPath(categoryID){
    return categoryList[categoryID][1];
}

// アマリ登録のリストを生成する
function MakeCategoryList(){
    const selectCategoryName = document.getElementById('category');
    const option = document.createElement('option'); //option要素を新しく作る
    option.value = ""; 
    option.innerHTML = "選択してください";
    option.hidden = true;
    selectCategoryName.appendChild(option); //セレクトボックスにoption要素を追加する

    //選択されたジャンルのメニュー一覧に対して処理をする
    categoryList.forEach((category, index) => {
      const option = document.createElement('option'); //option要素を新しく作る
      option.value = index; //option要素の値に、メニューを識別できる番号を指定する
      option.innerHTML = category[0]; //ユーザー向けの表示としてメニュー名を指定する
      
      selectCategoryName.appendChild(option); //セレクトボックスにoption要素を追加する
    });
}

// サガスサイドバーに表示するパネル一覧を生成
function MakeCategoryPanelTd(row,category,index){
    var td = document.createElement("td");
    var input = document.createElement("input");
    var div = document.createElement("div");
    //<td onclick="searchCategoryClicked('Cake')"     id='searchCategoryCake'    ></td>
    td.setAttribute("onclick",`searchCategoryClicked(${index})`);
    td.setAttribute("id", `searchCategory${index}`);
    input.setAttribute("type", "image");
    input.setAttribute("class", "searchCategory");
    input.setAttribute("src", category[1]);
    div.innerText=  category[0];
    td.appendChild(input);
    td.appendChild(div);
    row.appendChild(td);
}

// サガスサイドバーのパネルを選択状態にする
function SelectCategoryPanel(selectIndex){
    categoryList.forEach((category, index) => {
        let categoryPanel = document.getElementById(`searchCategory${index}`);
        if(index == selectIndex){
            categoryPanel.classList.add('searchCategoryActive');
            // $(`searchCategory${index}`).toggleClass("searchCategoryActive",true);	// パネルの選択を追加
        }else{
            categoryPanel.classList.remove('searchCategoryActive');
            // $(`searchCategory${index}`).toggleClass("searchCategoryActive",false);	// パネルの選択を削除
        }
      });
}

// サガスサイドバーのパネルを選択状態のリストを取得する
function GetSelectedCategoryPanelKeyList(){
    var keyList = [];
    categoryList.forEach((category, index) => {
        let categoryPanel = document.getElementById(`searchCategory${index}`);
        if(categoryPanel.classList.contains('searchCategoryActive')){
            keyList.push(index);
        }
    });
    
    return keyList;
}

// カテゴリパネルの選択状態を切り替え
function SwitchCategoryPanel(selectIndex){
    let categoryPanel = document.getElementById(`searchCategory${selectIndex}`);
    if(categoryPanel.classList.contains('searchCategoryActive')){
        // あったら削除
        categoryPanel.classList.remove('searchCategoryActive');
    }else{
        categoryPanel.classList.add('searchCategoryActive');
    }
}

function MakeCategoryPanel(){
    var tblBody = document.getElementById("searchCategoryArea");
    var loopNum = categoryList.length / 5 + 1;
    var ListIndex = 0;
    var row;
    var colNum;    // 列数
    var col;
    // creating all cells
    // for (var i = 0; i < loopNum; i++) {
    categoryList.forEach((category, index) => {
        
        if(true == isSmartPhone()){
            colNum = 4;
        }else{
            colNum = 4;
        }
        col = index%colNum;
        
        if(0 == col){
            // creates a table row
            row = document.createElement("tr");
            MakeCategoryPanelTd(row,category,index);
        }else if((colNum-1) == col){
            MakeCategoryPanelTd(row,category,index);
            // add the row to the end of the table body
            tblBody.appendChild(row);
            row = null;
        }else{
            MakeCategoryPanelTd(row,category,index);
        }
    });
    // まだ残っていれば追加
    if(row != null){
        // add the row to the end of the table body
        tblBody.appendChild(row);
    }
}
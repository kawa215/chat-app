var id = ['b']; //指定するidを全て配列で渡す

var tx = [];
var txCount = [];
var txSp = 50; // テキストの表示速度
var dly = 1000; // 次の文章までの待ち時間
var count = 0;

// window.onload = function(){
  kamikakushi();
  countSet();
  itimozi();
// }

function countSet(){ // 文字数カウントの初期設定
  for(n=0;n<id.length;n++){
    txCount[n] = 0;
  }
}


function kamikakushi(){ // 要素を取得して非表示（opacity:0;）にする
  for(i=0;i<id.length;i++){
    id[i] = document.getElementById(id[i]);
    tx[i] = id[i].firstChild.nodeValue; // 初期の文字列
    id[i].innerHTML = '';
  }
}

function itimozi(){ //　一文字ずつ表示
  id[count].innerHTML = tx[count].substr( 0, ++txCount[count] )+"_"; // テキストの指定した数の間の要素を表示
  if(tx[count].length != txCount[count]){ // Count が初期の文字列の文字数と同じになるまでループ
    setTimeout("itimozi()",txSp); // 次の文字へ進む
  }else{
  id[count].innerHTML = tx[count].substr( 0, ++txCount[count] ); // テキストの指定した数の間の要素を表示
    count++; // 次の段落に進む為のカウントアップ
    if(count != id.length){ // id数が最後なら終了
    setTimeout("itimozi()",dly); // 次の段落へ進む
    }
  }
}

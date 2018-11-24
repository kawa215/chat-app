

// データ保存用
var name = "";
var gender = 0;
var man = 0;
var womam = 0;

var flag = false;
var flag2 = false;


//関数実行
$(function () {
  //ボタンクリック
  $("#next").click( function() {

    name = $('#name').val();
    if(!isRealString(name)){
      alert("名前を入力してください!");
      window.location.href = '/';
    }

    gender = $('[name=radio]:checked').val();
    if(gender === undefined){
      alert("性別を選んでください!");
      window.location.href = '/';
    }

    console.log(gender);
    if(gender === '1'){
      //自分の男のパターンを選ばせる
      var car = $('#man-template').html();
      $('#setGroup').html(car);

    } else {
      var car = $('#woman-template').html();
      $('#setGroup').html(car);
    }

    var template = $('#message-template').html();
    var html = Mustache.render(template, {
      text: "あなたのキャラクターを選んでください!<br>選んだキャラクターは相手の画面に表示されます.",
    });
    $('#message-box').html(html);

    if(gender === '1'){
      console.log("man");
      //自分の男のパターンを選ばせる
      $("#man1").click( function() {
        man = 1;
        type();
      });
      $("#man2").click( function() {
        man = 2;
        type();
      });
      $("#man3").click( function() {
        man = 3;
        type();
      });
      $("#man4").click( function() {
        man = 4;
              type();
      });
      $("#man5").click( function() {
        man = 5;
              type();
      });
    }
    else {
      $("#woman1").click( function() {
        woman = 1;
              type();
      });
      $("#woman2").click( function() {
        woman = 2;
              type();
      });
      $("#woman3").click( function() {
        woman = 3;
              type();
      });
      $("#woman4").click( function() {
        woman = 4;
              type();
      });
      $("#woman5").click( function() {
        woman = 5;
              type();
      });
    }

  });
  console.log("out",gender);



  var type = function () {
    console.log('繊維先');
    var template = $('#message-template').html();
    if(gender === '1') {
      var html = Mustache.render(template, {
        text: "好きな女の子を選んでください!<br>選んだキャラクターとゲームを開始します.",
      });
    } else {
      var html = Mustache.render(template, {
        text: "好きな男の子を選んでください!<br>選んだキャラクターとゲームを開始します.",
      });
    }
    $('#message-box').html(html);

    // 好み
    if(gender === '1'){
      //自分の男のパターンを選ばせる
      var car = $('#woman-template').html();
      $('#setGroup').html(car);

    } else {
      var car = $('#man-template').html();
      $('#setGroup').html(car);
    }

    if(gender === '1'){
      //好きな女のパターンを選ばせる
      $("#woman1").click( function() {
        woman = 1;
        final();
      });
      $("#woman2").click( function() {
        woman = 2;
        final();
      });
      $("#woman3").click( function() {
        woman = 3;
        final();
      });
      $("#woman4").click( function() {
        woman = 4;
        final();
      });
      $("#woman5").click( function() {
        woman = 5;
        final();
      });
    }
    else {
      $("#man1").click( function() {
        man = 1;
        final();
      });
      $("#man2").click( function() {
        man = 2;
        final();
      });
      $("#man3").click( function() {
        man = 3;
        final();
      });
      $("#man4").click( function() {
        man = 4;
        final();
      });
      $("#man5").click( function() {
        man = 5;
        final();
      });
    }

  }


  var final = function () {
    window.location.href = "home.html" + "?name=" + this.name + "&gender=" + this.gender + "&man=" + this.man + "&woman=" + this.woman;
  }
});

//솝트 서버 1차 세미나 

//스트링에서의 백틱문자열
// let grade = 4;
// console.log(`안녕하세요 저는 ${grade}학년 입니다.`); //굳이 세미콜론안써도된다.

// console.log(7+18+"원"); //넘버+스트링은 ㄱㅊ ->25원
// console.log("원"+7+18); //스트링+넘버 경우 넘버가 스트링처럼 더해진다. -> 원718

// var num = 1;
// var str = "1";
//  console.log(typeof(num));
//  console.log(typeof(str));

//  if(num == str){
//      console.log("동치 연산자 true");

//  }else{
//      console.log("동치 연산자 false");
//  }

//  if(num === str){
//     console.log("일치 연산자 true");
//  }else{
//     console.log("일치 연산자 false");
//  }

//  var v2 = "v2";

//  function funcTest3(){
//      let l2 = "l2";
//      console.log(v2);
//      console.log(l2);
//  };

//  funcTest3();

//  if(true){
//      const c2 = "c2";
//      console.log(c2);
//  }

//  console.log(v2);
//  console.log(l2);
//  console.log(c2);  이건 실행 안된다. 


//이름 나이 학교 과 전화번호 자신의 생일날짜와일 을 가진 제이슨 객체를 만들고 그걸 출력하는 함수를 만들기(화살표로)/백틱문자,

var suzzang = {
    "name":"최수정",
    "age":"23",
    "univ":"숙명여대",
    "major":"아이티공학",
    "num":"01039596320",
    "birth_month":"3",
    "birth_date":"25"
};


var print=(json)=>{
    for(key in json){
        console.log(key+":"+json[key]);
    }
}

print(suzzang);

console.log(`제 생일은 ${suzzang.birth_month}월 ${suzzang.birth_date}입니다`);

var array = new Array();

array = ["1","2","3","4","5","6","7","8","9","10","11","12"];

function print2() {
    for(var i = 0 ; i<array.length;i++){
        if(array[i]== suzzang.birth_month){
            console.log(array[i]);
            break;
        }
    }
    
}

//11511

let var2 = new Array();

var2 = [1,1,5,1,1];

var unique = var2.reduce(function(a,b){
    if(a.indexOf(b)<0){
        a.push(b);
        return a;
    }
},[]);

console.log(unique)




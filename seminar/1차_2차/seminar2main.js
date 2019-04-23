const moduleArr = [7,2,"Hello World",11,"node","server",8,1];
const m = require('/Users/suzzang/Desktop/Suuzzangs/Develope/Sopt/Server_Node_24th/seminar2module.js');
for(var i = 0; i< moduleArr.length;i++){
    if(isNaN(moduleArr[i])){
        console.log(m.funcB(moduleArr[i]));
    }else{
        
        if(moduleArr[i]%2==0){
            console.log(m.b);
            console.log(m.funcA(moduleArr[i]));
        }else if(moduleArr[i]%2!=0){
            console.log(m.a);
        }
    }
}
module.exports = {

    a : "홀수입니다!",
    b :"짝수입니다!",

    funcA:(x) =>{
        let a = Math.pow(2,x);
        return a;
    },
    funcB:(y) =>{
    
        let b = y.split("").reverse().join("");
        return b;
    }
}
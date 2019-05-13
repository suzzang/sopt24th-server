
const crypto_promise = require('crypto-promise');
const crypto = require('crypto');
const fs = require('fs');
const json2csv = require('json2csv');
const csvtojson = require('csvtojson');

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
var express = require('express');
var router = express.Router();


//3차세미나 실습과제 - 포트번호 3007

router.get('/', (req,res)=>{
    //localhost:3000/training/info/?name=최수정 ->이건 쿼리
    //  /:id -> params 이다 


    //잘됐으면 resolve 에넣어주고 잘못됐으면 reject에 넣긔
    //그리고 실행할때 프로미스이름.then() 요로케 

    const getInfo_promise = (param)=>{
        return new Promise((resolve,reject)=>{
            if(param){
               csvtojson().fromFile(param).then((jsonObj)=>{
                resolve(jsonObj);
               });
            }else{
                reject("실패");
            }
        });
    }


    getInfo_promise('myinfo.csv').then((json_obj)=>{
        res.status(200).send(utils.successTrue(200,resMessage.GET_INFO_SUCCESS,json_obj));
        res.end
    },(error)=>{
        console.log(error);
    });


});

router.post('/', async(req,res)=>{ //이래야지 어웨이트를 여기서 바로 쓸수 잇다. 
    //localhost:3000/training/info/
    //body={name:"최수정",age:"23"}

    //req.body 로 내가 넘긴 바디를 볼 수 있다. 객체 접근 처럼 .name, .age 로 각각 접근한다. 
    

// const myInfo = {
//     name:"최수정",
//     age:"23",
//     univ:"숙명여자대학교",
//     major:"ICT융합공학부 IT공학전공"
// };


const salt = await crypto_promise.randomBytes.toString('base64'); //이게 바로 cripto-promise 를 쓴 것 이다. 
crypto.pbkdf2(req.body.age,salt,10,32,'SHA512',(err,result)=>{
    if(err){
        console.log(err);
    }else{
        const hashed_age = result.toString('base64');
        const resultCsv = json2csv.parse({
            name : req.body.name,
            age : hashed_age,
            univ : req.body.univ,
            major : req.body.major
        })
        fs.writeFile('myinfo.csv',resultCsv,(err)=>{
            if(err){
                console.log(err);
            }else{
                res.status(200).send(utils.successTrue(200,resMessage.POST_INFO_SUCEESS));
                res.end();
            }
        })
    }
});


});

module.exports = router;

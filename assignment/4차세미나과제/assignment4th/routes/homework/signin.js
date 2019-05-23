var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const db = require('../../module/pool');


router.post('/',async(req,res)=>{

    const userId = req.body.id;
    const userPw = req.body.password;

    const saltQuery = 'SELECT password,salt FROM user WHERE id = (?)';
    const saltResult = await db.queryParam_Arr(saltQuery,[userId]);


    if(saltResult.length==0){
        res.status(200).send(utils.successFalse(statusCode.NOT_FOUND,'아이디가 존재하지 않습니다.'));
    }else{
        const salt = saltResult[0].salt;
        const pwd = saltResult[0].password;
    
        const re_hashed = await crypto.pbkdf2(userPw,salt,10,32,'SHA512');
        if(re_hashed.toString('base64') == pwd ){
            res.status(200).send(utils.successTrue(statusCode.OK,'로그인 성공'));
        }else{
            res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST,'비밀번호가 틀렸습니다.'));

        }
    }

   

})

module.exports = router;

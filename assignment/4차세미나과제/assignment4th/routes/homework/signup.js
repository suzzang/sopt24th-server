var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const db = require('../../module/pool');

router.post('/',async(req,res)=>{

    const signinQuery = 'INSERT INTO user (id, name, password, salt) VALUES (?, ?, ?, ?)';

    const salt = await crypto.randomBytes(32);
    const hashed_pw = await crypto.pbkdf2(req.body.password,salt.toString('base64'),10,32,'SHA512');

    const signinResult = await db.queryParam_Parse(signinQuery,[req.body.id,req.body.name,hashed_pw.toString('base64'),salt.toString('base64')]);

    if(signinResult){
        res.status(200).send(utils.successTrue(statusCode.OK,resMessage.MEMBERSHIP_INSERT_SUCCESS))

    }else{

    }
})




module.exports = router;

var express = require('express');
var router = express.Router();

const moment = require('moment');
const crypto = require('crypto-promise');

const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

const db = require('../../module/pool');

router.post('/',async(req,res)=>{
    const writeTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const postBoardQuery = 'INSERT INTO board (title,content,writer,writetime,boardPw,salt) VALUES (?,?,?,?,?,?) ';

    const salt = await crypto.randomBytes(32);
    const hashed_boardPW = await crypto.pbkdf2(req.body.boardPw,salt.toString('base64'),10,32,'SHA512');

    const postBoardResult = await db.queryParam_Parse(postBoardQuery,[req.body.title,req.body.content
        ,req.body.writer,writeTime,hashed_boardPW.toString('base64'),salt.toString('base64')]);

    if(postBoardResult){

        res.status(200).send(utils.successTrue(statusCode.OK,'게시글 작성 성공!'));

    }else{

    }

})


module.exports = router;

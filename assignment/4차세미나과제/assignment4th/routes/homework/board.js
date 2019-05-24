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

   // console.log(postBoardResult)
    if(postBoardResult){
        res.status(200).send(utils.successTrue(statusCode.OK,'게시글 작성 성공!'));
    }else{

    }

})

router.get('/',async(req,res)=>{
    const getBoardQuery = 'SELECT * FROM board';

    const getBoardResult = await db.queryParam_None(getBoardQuery);

   
    if(getBoardResult.length == 0){
        res.status(200).send(utils.successFalse(statusCode.NOT_FOUND,'게시글이 존재하지 않습니다.'));
    }else{
        console.log(getBoardResult)
        res.status(200).send(utils.successTrue(statusCode.OK,'게시글 불러오기 성공!',getBoardResult));
    }
})

router.get('/:idx',async(req,res)=>{
    const boardIdx =req.params.idx;
    console.log(boardIdx)

    const getBoard_idx_Query ='SELECT * FROM board WHERE boardIdx = (?)';
    const getBoard_idx_Result = await db.queryParam_Arr(getBoard_idx_Query,[boardIdx]);

    if(getBoard_idx_Result.length == 0){
        res.status(200).send(utils.successFalse(statusCode.NOT_FOUND,'해당 게시글이 존재하지 않습니다.'));
    }else{
        res.status(200).send(utils.successTrue(statusCode.OK,'해당 게시글 불러오기 성공!',getBoard_idx_Result));

    }

})

router.delete('/',async(req,res)=>{ //트랜잭션이용
    const boardIdx = req.body.boardIdx;
    const boardPw = req.body.boardPw;

    const deleteBoardQuery = 'DELETE  FROM board WHERE boardIdx = (?)';
    const isRightQuery = 'SELECT boardPw,salt FROM board WHERE boardIdx = (?)';

    const isRightResult = await db.queryParam_Arr(isRightQuery,[boardIdx]);

    const real_boardPw = isRightResult[0];
    const salt = isRightResult[1];

    const rehashed = await crypto.pbkdf2(boardPw,salt,10,32,'SHA512');
    if(rehashed.toString('base64') == real_boardPw){
        const deleteBoardResult = await db.queryParam_Arr(deleteBoardQuery,[boardIdx]);

        if(deleteBoardResult.affectedRows==1){
            res.status(200).send(utils.successTrue(statusCode.OK,'해당 게시글 삭제 완료!'));
        }else{
            res.status(200).send(utils.successFalse(statusCode.NOT_FOUND,'해당 게시글이 존재하지 않습니다'));

        }
    }else{ //비번 틀림
        res.status(200).send(utils.successFalse(statusCode.FORBIDDEN,'게시물 비밀번호가 틀렸습니다.'));

    }

    

    

})

module.exports = router;

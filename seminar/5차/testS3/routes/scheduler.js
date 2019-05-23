var express = require('express');
var router = express.Router();

const moment = require('moment');
const cron = require('node-cron');

// cron.schedule('*/1 * * * *', () => { //1분마다 실행하는 크론 표현식 
//     console.log("1분마다 실행");
//     console.log(moment().format('YYYY-MM-DD HH:mm:ss')) //moment() 이렇게 써줘야한다. 그리고 날짜로 받고 싶은 포맷을 정해주면된다.
//     console.log(`신입생 OT 이후 ${moment().diff(moment('2019-03-23'),"days")}일 지남`);
// }) //diff는 기준 날짜부터 오늘까지 몇일이 지났는지 알고 싶을 때 !

// cron.schedule('*/10 * * * *', () => { //10분마다 실행하는 크론 표현식 
//     console.log('10분마다 실행');
//     console.log(`30일 후 날짜 => ${moment().add(30,"days").format("YYYY년 MM월 D일")}`)
// })

module.exports = router;

//임의로 이렇게 스케쥴러 파일을 만들어 놓아도 된다. 
//하지만 얘도 인덱스에 등록을 해줘야 한다. 

//스케쥴러를 언제쓰냐? 메인에 있는 db들을 5분마다 갱신을 하도록 한다. 
var express = require('express');
var router = express.Router();
const fs = require('fs');
const json2csv = require('json2csv');
const db = require('../module/pool');
const upload = require('../config/multer');

router.post('/signup',upload.single('profileImg'),async(req, res)=>{
    const profileImg = req.file.location;
    const insertWomanQuery = 'INSERT INTO people (id, name, profileImg, password) VALUES (?, ?, ?, ?)';
    const insertWomanResult = await db.queryParam_Parse(insertWomanQuery, [req.body.id, req.body.name, profileImg, req.body.password]);
    
    if(insertWomanResult){
        res.end();
    }else{

    }

    // const resultCsv = json2csv.parse({ //폼데이터는 무조건 String으로 저장된다. 알아서 적절히 파싱
    //     id : req.body.id,
    //     name : req.body.name,
    //     profileImg : profileImg,
    //     password : req.body.password
    // });

    // fs.writeFile('poeple.csv',resultCsv,(err)=>{
    //     if(err){

    //     }else{
        
    //         res.end();
    //     }
    // })

    
})
module.exports = router;
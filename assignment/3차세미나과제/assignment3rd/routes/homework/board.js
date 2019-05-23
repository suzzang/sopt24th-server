var express = require('express');
var router = express.Router();

const crypto_promise = require('crypto-promise');
const crypto = require('crypto');
const fs = require('fs');
const json2csv = require('json2csv');
const json2csv_a = require('async-json2csv');
const csvtojson = require('csvtojson');
const window = require('window');
const utils = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');

router.post('/',async(req,res)=>{

    let date = new Date();

    const salt = await crypto_promise.randomBytes(32)
    
    crypto.pbkdf2(req.body.board_pwd,salt.toString('base64'),10,32,'SHA512',async(err,result)=>{
        const hashed_pwd = result.toString('base64');
        const boardData = {
            board_id : req.body.board_id,
            board_title : req.body.board_title,
            board_content : req.body.board_content,
            board_time : date,
            board_pwd : hashed_pwd,
            salt :salt.toString('base64') }
        if(err){
            //console.log(err);
        }else{

        const resultCsv = json2csv.parse({
                data : boardData,
                fields : Object.keys(boardData)
            });
            

            const jsonObj_promise = (param1,param2)=>{
                return new Promise((resolve,reject)=>{

                    fs.exists(param1,(exists)=>{
                        if(exists == false){
                            reject(new Error('파일 존재하지 않음'));
                        }else{
                            csvtojson().fromFile(param1).then(jsonObj=>{
                                for(let i = 0; i<jsonObj.length;i++){
                                  const data_json = JSON.parse(jsonObj[i].data);
                                  if(param2 == data_json.board_title){    
                                       reject(new Error('같은 제목 있음'));
                                  }
                                }                           
                                resolve(jsonObj);
                            });
                        }
                    })

                });
            };

            jsonObj_promise('board_info.csv',boardData.board_title).then((json_obj)=>{
               // console.log(json_obj)
            
                fs.appendFile('board_info.csv',resultCsv,async(err)=>{
                    if(err){
                       // console.log(err);
            
                    }else{
                        //console.log(resultCsv)
                        const js = await csvtojson().fromFile('board_info.csv');
                        console.log(js);
                        res.status(200).send(utils.successTrue(200,resMessage.BOARD_SAVED_SUCESS));
                    }
                });
            
            }).catch((err)=>{
                //console.log(err);
                
                if(err.message=='파일 존재하지 않음'){ //처음 저장할때
                    fs.writeFile('board_info.csv',resultCsv,(err)=>{
                        if(err){
                
                        }else{
                            //onsole.log(resultCsv)
                            res.status(200).send(utils.successTrue(200,resMessage.BOARD_SAVED_SUCESS));
                        }
                    });
                }else{ //같은 제목이 있을 때
                    res.status(200).send(utils.successFalse(400,resMessage.ALREADY_BOARD));
                }

            });
            
        
            
            

        }
    })
});

router.get('/:id',async(req,res)=>{

    const getBoard_promise = (fileName,id)=>{
        return new Promise((resolve,reject)=>{
            fs.exists(fileName,(exists2)=>{
                if(exists2 == false){
                    reject(new Error('파일 존재하지 않음'));
                }else{
                    csvtojson().fromFile(fileName).then(jsonObj2=>{
                        for(let i = 0; i<jsonObj2.length;i++){
                            const data_json2 = JSON.parse(jsonObj2[i].data);
                          if(id == data_json2.board_id){    
                              resolve(jsonObj2[i]);
                          }
                        }
                        
                        reject(new Error('해당하는 게시물이 없습니다.'));
                    });
                }
            });

        });
    };

    getBoard_promise('board_info.csv',req.params.id).then((json_obj2)=>{
        res.status(200).send(utils.successTrue(200,resMessage.GET_BOARD_SUCCESS,JSON.parse(json_obj2.data)));

    }).catch((err)=>{

       // console.log(err);

        if(err.message == '해당하는 게시물이 없습니다.'){
            res.status(200).send(utils.successFalse(400,resMessage.NO_BOARD));
        }else{ //파일 없을 때
            res.status(200).send(utils.successFalse(400,'파일이 없습니다.'));
        }

    });

});

router.put('/',async(req,res)=>{

    let date = new Date();
    const reqID = req.body.board_id;

    const originData_promise = (filePath)=>{
        return new Promise((resolve,reject)=>{
            fs.exists(filePath,(exists)=>{
                if(exists == false){
                    return reject(new Error('파일 존재하지 않음'));
                }else{
                    csvtojson().fromFile(filePath).then(data=>{
                        return resolve(data);
                    })
                }
            });
        })
    }

    originData_promise('board_info.csv').then(async(originData)=>{ //데이터와 필드로 구성된 제이슨 객체 배열 -> 데이터를 골라 다시 제이슨으로 파싱

        for(let i = 0;i<originData.length;i++){
          const pickData = JSON.parse(originData[i].data)
          //console.log(pickData);
          
          if(reqID == pickData.board_id){
              
              const re_hash = await crypto_promise.pbkdf2(req.body.board_pwd,pickData.salt,10,32,'SHA512')
              if(re_hash.toString('base64') == pickData.board_pwd){
                
                  pickData.board_title = req.body.board_title;
                  pickData.board_content = req.body.board_content;
                  pickData.board_time = date;

                  originData[i].data = JSON.stringify(pickData);
         
                  const result = json2csv.parse(originData)
                
                  fs.writeFile('board_info.csv',result,(err)=>{
                      //수정 성공
                      res.status(200).send(utils.successTrue(200,'수정성공'));
                  })
                  return;
              }else{
                  throw new Error('비번 다름');
                  
              }

          }

          
        }
        throw new Error('노 게시물');
        
    }).catch((err)=>{ //수정 에러 -> 비번다름 혹은 해당하는 게시물아이디 존재하지 않음
       // console.log(err);
        if(err.message == '파일 존재하지 않음'){
            res.status(200).send(utils.successTrue(400,'파일이 존재하지 않습니다.'));

        }else if(err.message == '비번 다름'){

            res.status(200).send(utils.successTrue(400,'비밀번호가 다릅니다.'));
        }else if(err.message == '노 게시물'){
            res.status(200).send(utils.successTrue(400,'해당 ID의 게시물이 존재하지 않습니다.'));
        }
        
    })


});

router.delete('/',async(req,res)=>{
    const reqID = req.body.board_id;
    const originData_promise = (filePath)=>{
        return new Promise((resolve,reject)=>{
            fs.exists(filePath,(exists)=>{
                if(exists == false){
                    reject(new Error('파일 존재하지 않음'));
                }else{
                    csvtojson().fromFile(filePath).then(data=>{
                       resolve(data);
                    })
                }
            });
            
        })
    }

    originData_promise('board_info.csv').then(async(originData)=>{
        for(let i = 0;i<originData.length;i++){
            const pickData = JSON.parse(originData[i].data)
            
            if(reqID == pickData.board_id){
                
                const re_hash = await crypto_promise.pbkdf2(req.body.board_pwd,pickData.salt,10,32,'SHA512')
                if(re_hash.toString('base64') == pickData.board_pwd){
                  
                   originData.splice(i,1);
            
                  //  console.log(originData);
                    let result;
                    if(originData.length == 0){
                       result = json2csv.parse({
                            data:[],
                            fields:['board_id', 'board_title', 'board_content', 'board_time', 'board_pwd', 'salt']
                        })
                    }else{
                       result = json2csv.parse(originData)
                    }
                                       
                  
                    fs.writeFile('board_info.csv',result,(err)=>{
                        //삭제 성공
                        res.status(200).send(utils.successTrue(200,'삭제성공'));
                       
                    })
                    return;
                }else{
                    throw new Error('비번 다름');
                }
            }
          }
          throw new Error('노 게시물');

    }).catch((err)=>{
       // console.log(err);
        if(err.message == '파일 존재하지 않음'){
            res.status(200).send(utils.successTrue(400,'파일이 존재하지 않습니다.'));

        }else if(err.message == '비번 다름'){

            res.status(200).send(utils.successTrue(400,'비밀번호가 다릅니다.'));
        }else if(err.message == '노 게시물'){
            res.status(200).send(utils.successTrue(400,'해당 ID의 게시물이 존재하지 않습니다.'));
        }
       
    })


})

module.exports = router;